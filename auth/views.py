import json
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.db.models import Q, Count
from django.views.generic import (
    FormView, CreateView, RedirectView, DetailView, UpdateView
)

from auth.mixins import LoginRequiredMixin
from auth.forms import (RegistrationForm, AuthenticationForm,
                            ProfileUpdateForm)
from django.contrib.auth.models import User


class RegistrationView(CreateView):
    form_class = RegistrationForm
    template_name = "auth/register.html"

    def form_valid(self, form):
        response = super(RegistrationView, self).form_valid(form)
        user = authenticate(username=form.cleaned_data["username"],
                            password=form.cleaned_data["password1"])
        login(self.request, user)
        return response

    def get_success_url(self):
        return reverse("home")


class LoginView(FormView):
    form_class = AuthenticationForm
    template_name = "auth/login.html"

    def form_valid(self, form):
        login(self.request, form.get_user())
        return super(LoginView, self).form_valid(form)

    def get_success_url(self):
        return self.request.GET.get("next") or reverse("home")

    def get_context_data(self, **kwargs):
        context = super(LoginView, self).get_context_data(**kwargs)
        context["next"] = self.request.GET.get("next", "")
        return context


class LogoutView(LoginRequiredMixin, RedirectView):
    def get(self, request, *args, **kwargs):
        logout(request)
        return super(LogoutView, self).get(request, *args, **kwargs)

    def get_redirect_url(self, **kwargs):
        return reverse("home")


class ProfileDetailView(DetailView):
    slug_field = 'username'
    slug_url_kwarg = 'username'
    context_object_name = "profile"
    model = User


class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    form_class = ProfileUpdateForm

    def get_object(self, queryset=None):
        return self.request.user

    def get_success_url(self):
        return '/'
