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

class PersonalSingHistory(models.Model):
    id = models.BigAutoField(primary_key=True)
    sing_at = models.DateTimeField()
    member = models.ForeignKey('Member', models.DO_NOTHING, blank=True, null=True)
    song = models.ForeignKey('Song', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personal_sing_history'

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

class BaseData(models.Model):
    id = models.BigAutoField(primary_key=True)
    member = models.ForeignKey('Member', models.DO_NOTHING, blank=True, null=True)
    song = models.ForeignKey('Song', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'base_data'

class TeamSingHistory(models.Model):
    id = models.BigAutoField(primary_key=True)
    sing_at = models.DateTimeField()
    song = models.ForeignKey('Song', models.DO_NOTHING, blank=True, null=True)
    team = models.ForeignKey('Team', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'team_sing_history'

class Team(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField()
    name = models.CharField(max_length=32)
    team_image = models.CharField(max_length=256, blank=True, null=True)
    used_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'team'
