from django import forms

from sketches.models import Sketch


class SketchCreationForm(forms.ModelForm):
    class Meta:
        fields = ('title', 'description', )
        model = Sketch

