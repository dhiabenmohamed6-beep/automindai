from django.db import models

class Service(models.Model):
    icon = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    bullets = models.JSONField(default=list)
    cover_image = models.ImageField(upload_to='services/', blank=True, null=True)
    cover_gradient = models.CharField(max_length=200, default='linear-gradient(135deg,#0057FF,#00A3FF)')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class Industry(models.Model):
    name = models.CharField(max_length=200)
    before_text = models.TextField()
    after_text = models.TextField()
    stats = models.JSONField(default=list)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name_plural = 'industries'

    def __str__(self):
        return self.name


class Portfolio(models.Model):
    CATEGORIES = [
        ('automation', 'Automation & Agents'),
        ('chatbot', 'Chatbots & Agents'),
        ('industrial', 'Industrial'),
    ]
    title = models.CharField(max_length=300)
    tag = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORIES, default='automation')
    icon = models.CharField(max_length=100, default='automation')
    description = models.TextField()
    stack = models.JSONField(default=list)
    image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class ContactSubmission(models.Model):
    SERVICES = [
        ('ai_automation', 'AI Automation'),
        ('chatbot', 'AI Chatbots / Agents'),
        ('web_software', 'Website / Software Development'),
        ('industrial', 'Industrial Automation'),
        ('not_sure', 'Not sure yet'),
    ]
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    service = models.CharField(max_length=50, choices=SERVICES, blank=True)
    message = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.full_name} - {self.email}"
