# -*- coding: utf-8 -*-
# Generated by Django 1.9.12 on 2017-04-13 20:11
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_auto_20170307_1950'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='completed_challenges',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={'game_one': 0, 'game_three': 0, 'game_two': 0}),
        ),
    ]
