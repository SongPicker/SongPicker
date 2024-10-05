# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Song(models.Model):
    id = models.BigAutoField(primary_key=True)
    acousticness = models.IntegerField()
    bpm = models.IntegerField()
    composer = models.CharField(max_length=256)
    cover_image = models.CharField(max_length=256, blank=True, null=True)
    danceability = models.IntegerField()
    energy = models.IntegerField()
    genre = models.CharField(max_length=255)
    happiness = models.IntegerField()
    is_popular = models.IntegerField()
    lyricist = models.CharField(max_length=256)
    lyrics = models.TextField()
    number = models.IntegerField(unique=True)
    released_at = models.DateField()
    singer = models.CharField(max_length=256)
    title = models.CharField(max_length=60)
    tune = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'song'

# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.


class PersonalSingHistory(models.Model):
    id = models.BigAutoField(primary_key=True)
    sing_at = models.DateTimeField()
    member = models.ForeignKey('Member', models.DO_NOTHING, blank=True, null=True)
    song = models.ForeignKey('Song', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personal_sing_history'
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Member(models.Model):
    id = models.BigAutoField(primary_key=True)
    birth = models.DateField()
    created_at = models.DateTimeField()
    gender = models.CharField(max_length=6, blank=True, null=True)
    is_withdraw = models.TextField()  # This field type is a guess.
    login_id = models.CharField(unique=True, max_length=16)
    name = models.CharField(max_length=16)
    nickname = models.CharField(max_length=8)
    password = models.CharField(max_length=256)
    phone = models.CharField(max_length=11)
    profile_image = models.CharField(max_length=256, blank=True, null=True)
    role = models.CharField(max_length=10, blank=True, null=True)
    withdrawn_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'member'
