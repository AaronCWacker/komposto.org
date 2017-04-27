# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from unidecode import unidecode
from jsonfield import JSONField
from uuid import uuid4

from django.db import models
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django.template.defaultfilters import slugify
from django.utils.encoding import smart_unicode


class Sketch(models.Model):
    """
    Holds user specific sketch data.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sketches')
    fork_of = models.ForeignKey('self', blank=True, null=True)
    title = models.CharField('title', max_length=255)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True)
    content = JSONField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)
    tags = models.ManyToManyField('Tag', blank=True)

    class Meta:
        ordering = ['-id']

    def __unicode__(self):
        return smart_unicode(self.title)

    @models.permalink
    def get_absolute_url(self):
        return 'sketch_detail', [self.slug]

    @models.permalink
    def get_sandbox_url(self):
        return 'sketch_sandbox', [self.slug]

    def get_preview_url(self):
        if self.snapshots.exists():
            return self.snapshots.latest('id').content.url

    def get_extra_thumbnails(self):
        if self.snapshots.count() > 1:
            return self.snapshots.all()[1:5]

        return []

    def save(self, *args, **kwargs):
        """
        Make unique slug if it is not given.
        """
        if not self.slug:
            slug = slugify(unidecode(self.title))
            duplications = type(self).objects.filter(slug=slug)
            if duplications.exists():
                self.slug = "%s-%s" % (slug, uuid4().hex)
            else:
                self.slug = slug

        return super(Sketch, self).save(*args, **kwargs)

    def serialize(self):
        user = self.user
        return {
            'user': {
                'username': user.username,
                'id': user.id,
            },
            'title': self.title,
            'id': self.id,
            'content': self.get_content(),
            'date_created': self.date_created,
            'date_modification': self.date_modification,
            'description': self.description,
            'absolute_url': self.get_absolute_url()
        }

    def get_content(self):
        return [
            line['code'] if 'code' in line else line
            for line in self.content or []
        ]

    def as_json(self):
        return json.dumps(self.serialize(), cls=DjangoJSONEncoder)


class Snapshot(models.Model):
    """
    Holds instant snapshots of sketches.
    """
    sketch = models.ForeignKey(Sketch, related_name='snapshots')
    title = models.CharField('title', max_length=255, blank=True, null=True)
    content = models.ImageField(upload_to='snapshots', blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return smart_unicode(self.title or self.pk)


class Tag(models.Model):
    """
    Holds entity independent tags
    """
    title = models.CharField('title', max_length=255, unique=True)
    slug = models.SlugField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        """
        Make unique slug if it is not given.
        """
        if not self.slug:
            slug = slugify(unidecode(self.title))
            duplications = type(self).objects.filter(slug=slug)
            if duplications.exists():
                self.slug = "%s-%s" % (slug, uuid4().hex)
            else:
                self.slug = slug

        return super(Tag, self).save(*args, **kwargs)

    def __unicode__(self):
        return smart_unicode(self.title or self.pk)
