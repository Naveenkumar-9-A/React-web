from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('treks_app', '0009_alter_contact_options_remove_blog_image_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE treks_app_contact
                ADD COLUMN IF NOT EXISTS trek_category varchar(50);
            """,
            reverse_sql="""
                ALTER TABLE treks_app_contact
                DROP COLUMN IF EXISTS trek_category;
            """
        ),
    ]