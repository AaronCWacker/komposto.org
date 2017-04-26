from django.conf.urls import url, include
from django.contrib import admin

from sketches.views import (
	SketchListView, SketchDetailView, HomeView,
	PlayView, SandboxView, NewSketchView,
	SnapshotView, SketchForkView, HelpView,
	AboutView
)


urlpatterns = [
	url(r'^$', HomeView.as_view(), name='home'),
	url(r'^about$', AboutView.as_view(), name='about'),
	url(r'^about/help$', HelpView.as_view(), name='help'),
	url(r'^sketches/new$', NewSketchView.as_view(), name='new_sketch'),
	url(r'^sketches/(?P<slug>[\w-]+)$', PlayView.as_view(), name='sketch_detail'),
	url(r'^sketches/(?P<slug>[\w-]+)/sandbox$', SandboxView.as_view(), name='sketch_sandbox'),
	url(r'^sketches/(?P<slug>[\w-]+)/preview$', SnapshotView.as_view(), name='sketch_snapshot'),
    url(r'^api/sketches$', SketchListView.as_view(), name='api_sketch_list'),
    url(r'^api/sketches/(?P<pk>[0-9]+)$', SketchDetailView.as_view(), name='api_sketch_detail'),
    url(r'^api/sketches/(?P<pk>[0-9]+)/fork$', SketchForkView.as_view(), name='api_sketch_fork'),
]
