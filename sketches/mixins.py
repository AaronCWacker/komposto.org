from django.http import JsonResponse

from sketches.utils import int_or_zero


class JSONResponseListMixin(object):
    """
    A mixin that can be used to render a JSON response.
    """
    def render_to_response(self, context, **response_kwargs):
        """
        Returns a JSON response, transforming 'context' to make the payload.
        """
        return JsonResponse(
            self.get_data(context),
            **response_kwargs
        )

    def get_data(self, context):
        """
        Returns an object that will be serialized as JSON by json.dumps().
        """
        return {
            "objects": [
                object.serialize()
                for object in self.get_queryset()
            ],
            "has_more": self.has_next_page(),
            "next_page_url": self.get_next_page_url(),
        }


class JSONResponseDetailMixin(object):
    """
    A mixin that can be used to render a JSON response.
    """
    def render_to_response(self, context, **response_kwargs):
        """
        Returns a JSON response, transforming 'context' to make the payload.
        """
        return JsonResponse(
            self.get_object().serialize(),
            **response_kwargs
        )


class PaginationMixin(object):
    paginate_by = 20

    def get_offset(self):
        return int_or_zero(self.request.GET.get("offset"))

    def get_limit(self):
        return self.get_offset() + self.paginate_by

    def has_next_page(self):
        total = self.model.objects.count()
        return total > (self.get_offset() + self.paginate_by)

    def get_next_page_url(self):
        offset = self.get_offset() + self.paginate_by
        return '?offset=%(offset)s' % {
            "offset": offset
        }
