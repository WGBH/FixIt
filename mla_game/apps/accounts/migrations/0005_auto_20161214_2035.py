# -*- coding: utf-8 -*-
# Generated by Django 1.9.11 on 2016-12-14 20:35
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_transcriptpicks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transcriptpicks',
            name='picks',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={}),
        ),
    ]
