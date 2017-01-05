# -*- coding: utf-8 -*-
# Generated by Django 1.9.11 on 2016-12-29 15:38
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('transcript', '0003_transcriptmetadata_media_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='TranscriptPhraseCorrectionVote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.RemoveField(
            model_name='transcriptphrasecorrection',
            name='votes',
        ),
        migrations.AddField(
            model_name='transcriptphrasecorrectionvote',
            name='transcript_phrase_correction',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='transcript.TranscriptPhraseCorrection'),
        ),
        migrations.AddField(
            model_name='transcriptphrasecorrectionvote',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]