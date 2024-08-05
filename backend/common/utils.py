import random
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from accounts.models import OTP

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(user, otp):
    subject = 'ONION pong OTP'
    message = f'Your OTP code is {otp}'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    send_mail(subject, message, email_from, recipient_list)

def create_and_send_otp(user):
    otp = generate_otp()
    expires_at = timezone.now() + timedelta(minutes=10)  # Use timezone-aware datetime
    OTP.objects.update_or_create(user=user, defaults={'otp': otp, 'expires_at': expires_at})
    send_otp_email(user, otp)
