from django.dispatch import receiver
from allauth.account.signals import user_signed_up, user_logged_in

@receiver(user_signed_up)
def handle_user_signed_up(request, sociallogin, user, **kwargs):

    # grab the user's data
    new_user_data = sociallogin.account.extra_data

    print(new_user_data)

    # perform tasks/processing on data
