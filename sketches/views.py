# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import json
import markdown
import base64
from uuid import uuid4
from PIL import Image

from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.list import ListView
from django.http import JsonResponse
from django.views.generic.detail import DetailView
from django.views.generic import TemplateView, View
from django.views.generic import CreateView
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.core.files.base import ContentFile

from auth.mixins import LoginRequiredMixin
from sketches.models import Sketch
from sketches.forms import SketchCreationForm
from sketches.mixins import (
    JSONResponseListMixin, JSONResponseDetailMixin, 
    PaginationMixin
)


class SketchListView(PaginationMixin, JSONResponseListMixin, ListView):
    model = Sketch

    def get_queryset(self):
        return (
            self.model.objects.all()[
                self.get_offset():
                self.get_limit()
            ]
        )


class SketchDetailView(JSONResponseDetailMixin, DetailView):
    model = Sketch

    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(SketchDetailView, self).dispatch(*args, **kwargs)

    def post(self, request, pk):
        sketch = get_object_or_404(Sketch, pk=pk)

        if sketch.user.pk != request.user.pk:
            return HttpResponse(status=403)

        payload = json.loads(request.body)
        sketch.content = payload.get('content')
        sketch.title = payload.get('title')
        sketch.description = payload.get('description')
        sketch.save();

        if payload.get('snapshot'):
            snapshot = payload.get('snapshot')
            binary = base64.b64decode(snapshot)
            content = ContentFile(
                binary,
                name='%s.png' % sketch.slug
            )
            sketch.snapshots.create(content=content)

        return HttpResponse(status=202)


class SketchForkView(LoginRequiredMixin, View):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(SketchForkView, self).dispatch(*args, **kwargs)

    def post(self, request, pk):
        fork_of = get_object_or_404(Sketch, pk=pk)

        payload = json.loads(request.body)

        sketch = Sketch.objects.create(
            user=request.user,
            title=payload.get('title'),
            description=payload.get('description'),
            content=payload.get('content'),
            fork_of=fork_of
        )

        if payload.get('snapshot'):
            snapshot = payload.get('snapshot')
            binary = base64.b64decode(snapshot)
            content = ContentFile(
                binary,
                name='%s.png' % sketch.slug
            )
            sketch.snapshots.create(content=content)

        return JsonResponse(sketch.serialize(), status=201)


class HomeView(PaginationMixin, TemplateView):
    template_name = 'sketches/index.html'
    model = Sketch

    def get_queryset(self):
        return (
            self.model.objects.filter(
                is_featured=True
            )[
                self.get_offset():
                self.get_limit()
            ]
        )

    def get_context_data(self, **kwargs):
        return super(HomeView, self).get_context_data(
            sketches=self.get_queryset(),
            next_page_url=self.get_next_page_url(),
            **kwargs
         )


class HelpView(TemplateView):
    def get_template_names(self):
        if self.request.GET.get('only-content'):
            return ['sketches/help-content.html']

        return ['sketches/help.html']

    def get_context_data(self, **kwargs):
        path = os.path.join(os.path.dirname(__file__), '../docs/help.md')
        content = markdown.markdown(open(path).read())
        return super(HelpView, self).get_context_data(
            content=content,
            **kwargs
         )


class AboutView(TemplateView):
    template_name = "about.html"

    def get_context_data(self, **kwargs):
        path = os.path.join(os.path.dirname(__file__), '../docs/about.md')
        content = markdown.markdown(open(path).read())
        return super(AboutView, self).get_context_data(
            content=content,
            **kwargs
         )


class PlayView(DetailView):
    template_name = 'sketches/detail.html'
    model = Sketch

    def dispatch(self, *args, **kwargs):
        nonce = uuid4()
        self.request.nonce = nonce
        response = super(PlayView, self).dispatch(*args, **kwargs)
        response.set_cookie('nonce', nonce)
        return response

    def get_context_data(self, **kwargs):
        return super(PlayView, self).get_context_data(
            nonce=self.request.nonce,
            **kwargs
        )


class SandboxView(DetailView):
    template_name = 'sketches/sandbox.html'
    model = Sketch

    @xframe_options_sameorigin
    def dispatch(self, request, *args, **kwargs):
        if request.COOKIES.get('nonce') != request.GET.get('nonce'):
            return HttpResponse(status=403)

        return super(SandboxView, self).dispatch(request, *args, **kwargs)


class NewSketchView(CreateView):
    form_class = SketchCreationForm
    template_name = "sketches/new.html"

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(NewSketchView, self).form_valid(form)


class SnapshotView(DetailView):
    model = Sketch

    def render_to_response(self, context, **response_kwargs):
        snapshot = self.object.snapshots.latest('id')
        image = Image.new("RGBA", (360, 640))
        import pdb; pdb.set_trace();
        image.putdata(snapshot.content)
        response = HttpResponse(content_type="image/jpg")
        image.save(response, "JPEG")
        return response
