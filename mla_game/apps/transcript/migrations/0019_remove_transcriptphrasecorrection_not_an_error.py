# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-31 18:32
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0018_auto_20171031_1422'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transcriptphrasecorrection',
            name='not_an_error',
        ),
    ]