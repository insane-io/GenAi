# chatbot/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import *
from .serializers import *
import google.generativeai as genai

def format_theme(theme):
    """Helper function to format the theme string."""
    theme = theme.lower().replace("&", "and").replace(" ", "-").strip()
    return f"theme-{theme}"

def generate_gemini_summary(history_text):
    genai.configure(api_key="AIzaSyBvMtbKwkTOo3N7Z934TRCCXZL2dSnF5cw")

    prompt = (
        f"Summarize the following chat in 3 to 4 words:\n{history_text}"
    )

    try:
        response = genai.GenerativeModel(model_name="gemini-1.0-pro").generate_content(prompt)
        if response:
            summary =  response.text
            return summary
        else:
            return "No summary available."

    except Exception as e:
        print("Error generating Gemini summary: ", str(e))
        return "Error generating summary."


def generate_gemini_response(history_text):
    genai.configure(api_key="AIzaSyBvMtbKwkTOo3N7Z934TRCCXZL2dSnF5cw")

    prompt = (
    f"You are an AI providing emotional support and give them advice which will help user to calm him. Below is a chat conversation. "
    f"Please analyze the overall sentiment of the conversation, suggest a background color based on the emotion, "
    f"and provide a short, empathetic response to the latest user message.\n\n"
    f"Conversation:\n{history_text}\n\n"
    f"Respond with:\n1. Sentiment (positive, neutral, negative)\n"
    f"2. Suggested background color (hex code or name)\n"
    f"3. Response message\n"
    f"4. Theme (choose from the following and use format: theme-calm-and-tranquil, theme-energize-and-uplift, etc.):\n"
    f"   - Calm & Tranquil\n"
    f"   - Energize & Uplift\n"
    f"   - Soothing & Reflective\n"
    f"   - Comfort & Warmth\n"
    f"   - Focus & Clarity\n"
    f"   - Inspiration & Motivation\n"
    f"   - Hope & Optimism\n"
    f"   - Peace & Balance\n"
    f"   - Joy & Creativity"
)

    try:
        response = genai.GenerativeModel(
            model_name="gemini-1.0-pro"
        ).generate_content(prompt)
    except Exception as e:
        print("Error generating Gemini response: ", str(e))
        return "neutral", "#FFFFFF", "Sorry, an error occurred while generating the response."

    # Print the raw response for debugging
    print("Raw API Response: ", response.text)

    if not response or not response.text:
        return "neutral", "#FFFFFF", "Sorry, I could not generate a response at the moment."

    lines = response.text.split('\n')
    
    # Default values in case the parsing fails
    sentiment = "neutral"
    bg_color = "#FFFFFF"
    bot_reply = "Sorry, I couldn't come up with a response."
    theme = "theme-calm-and-tranquil"

    # Parse lines with more flexibility
    for line in lines:
        if "Sentiment" in line:
            sentiment = line.split(":")[1].strip()
        elif "Suggested background color" in line:
            bg_color = line.split(":")[1].strip()
        elif "Theme" in line:
             if "-" in line:  # Check if the line contains the expected theme format
                theme_raw = line.split("-")[1].strip()  # Extract theme part after 'Theme-'
                theme = format_theme(theme_raw)
        elif line.startswith("3. "):  # This should capture the bot reply
            bot_reply = line.split(":")[1].strip()
    
    # if bot_reply.startswith("3."):
    #     bot_reply = bot_reply.split(":").strip()

    return sentiment, bg_color, bot_reply, theme

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_view(request):
    user = request.user
    user_input = request.data.get("message", "")
    session_id = request.data.get("session_id", None)

    if session_id:
        session = ChatSession.objects.get(session_id=session_id, user=user)
    else:
        session = ChatSession.objects.create(user=user)

    chat_history = ChatMessage.objects.filter(session=session).order_by('timestamp')

    history_text = ""
    for message in chat_history:
        history_text += f"User: {message.user_message}\nBot: {message.bot_response}\n"

    history_text += f"User: {user_input}\n"

    sentiment, bg_color, bot_reply, theme= generate_gemini_response(history_text)
    if not session.summary:
        initial_summary = generate_gemini_summary(history_text)

        session.summary = initial_summary
        session.save()

    ChatMessage.objects.filter(session=session).update(is_old=True)
    ChatMessage.objects.create(session=session, user_message=user_input, bot_response=bot_reply)

    return Response({
        "message": bot_reply,
        "session_id": session.session_id,
        "background_color": bg_color,
        "sentiment": sentiment,
        "theme" : theme,
    })


@api_view(['POST'])
def start_chat_session(request):
    user = request.user
    chat_session = ChatSession.objects.create(user=user)
    serializer = ChatSessionSerializer(chat_session)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_session(request):
    try:
        session_id = request.GET.get('session_id')
        session = ChatSession.objects.get(session_id=session_id)
        messages = ChatMessage.objects.filter(session_id=session).order_by('timestamp')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ChatMessage.DoesNotExist:
        return Response({'Error': 'Chat does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_chats(request):
    try:
        sessions = ChatSession.objects.filter(user=request.user, summary__isnull=False).exclude(summary='')
        serializer = SummarySerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ChatSession.DoesNotExist:
        return Response({'Error': 'Chat session not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
