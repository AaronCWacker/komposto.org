# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from sketches.models import Sketch, Snapshot, Tag

admin.site.register(Sketch)
admin.site.register(Snapshot)
admin.site.register(Tag)
