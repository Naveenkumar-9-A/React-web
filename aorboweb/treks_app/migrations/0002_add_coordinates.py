# Generated migration for adding coordinates to TrekList

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('treks_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='treklist',
            name='latitude',
            field=models.FloatField(blank=True, help_text='Latitude coordinate (auto-geocoded)', null=True),
        ),
        migrations.AddField(
            model_name='treklist',
            name='longitude',
            field=models.FloatField(blank=True, help_text='Longitude coordinate (auto-geocoded)', null=True),
        ),
    ]
