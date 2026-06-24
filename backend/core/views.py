from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
import json
import requests
import random
import re as _re
from .models import Service, Industry, Portfolio, ContactSubmission
from .serializers import (
    ServiceSerializer, IndustrySerializer,
    PortfolioSerializer, ContactSubmissionSerializer
)


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer

class IndustryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Industry.objects.filter(is_active=True)
    serializer_class = IndustrySerializer

class PortfolioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Portfolio.objects.filter(is_active=True)
    serializer_class = PortfolioSerializer

    @action(detail=False, methods=['get'])
    def categories(self, request):
        cats = [{'value': k, 'label': v} for k, v in Portfolio.CATEGORIES]
        return Response(cats)

class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['post'])
    def submit(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'message': 'Message received!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EstimateView(APIView):
    def post(self, request):
        category = request.data.get('category', 'chatbot')
        scope = request.data.get('scope', 'starter')
        timeline = request.data.get('timeline', 'standard')

        base = {
            'chatbot': 800, 'automation': 1200, 'web': 900,
            'app': 3000, 'industrial': 2500, 'platform': 5000
        }.get(category, 800)

        scope_mult = {'starter': 1, 'growth': 1.8, 'enterprise': 3.2}.get(scope, 1)
        low = int(base * scope_mult)
        high = int(low * 1.6)

        if timeline == 'rush':
            low = int(low * 1.25)
            high = int(high * 1.3)

        weeks_low = {'starter': 3, 'growth': 6, 'enterprise': 10}.get(scope, 3)
        weeks_high = int(weeks_low * (0.6 if timeline == 'rush' else 1.6))

        stacks = {
            'chatbot': ['NLU engine', 'Helpdesk API', 'Multilingual support'],
            'automation': ['Workflow engine', 'CRM/API integrations', 'Monitoring & alerts'],
            'web': ['Next.js', 'TailwindCSS', 'SEO & analytics'],
            'app': ['React Native', 'Push notifications', 'App store deployment'],
            'industrial': ['IoT sensors', 'Control systems', 'Real-time dashboard'],
            'platform': ['AI orchestration', 'Custom backend', 'Admin dashboard'],
        }

        return Response({
            'low': low,
            'high': high,
            'weeks_low': max(1, weeks_low if timeline != 'rush' else int(weeks_low * 0.6)),
            'weeks_high': weeks_high,
            'stack': stacks.get(category, stacks['chatbot'])
        })


DEMO_SYSTEMS = {
    'tagline': "You write short, punchy marketing taglines for businesses. Given a business description, return exactly 3 tagline options, one per line, with no numbering and no extra commentary.",
    'email': "You draft short, professional business emails. Given the user's brief, write a complete email including a subject line and body. Keep it concise and natural.",
    'summarize': "You summarize text into 3-4 clear bullet points, preserving the key facts. No preamble, no closing remarks.",
    'translate': "You translate text accurately into the requested target language. Return only the translation, with no commentary.",
    'idea': "You generate one practical AI-automation business idea tailored to the industry or description given, in 3-4 sentences: what it automates, who it's for, and the rough impact. No preamble.",
    'plan': "You create a short, step-by-step automation plan (4-6 numbered steps) for the described business process, focusing on triggers, tools and actions. No preamble.",
}

class DemoView(APIView):
    def post(self, request):
        tool_id = request.data.get('toolId')
        values = request.data.get('values', {})
        system = DEMO_SYSTEMS.get(tool_id, DEMO_SYSTEMS['tagline'])

        api_key = getattr(settings, 'ANTHROPIC_API_KEY', '')
        if api_key:
            try:
                user_content = self.build_user_content(tool_id, values)
                resp = requests.post(
                    'https://api.anthropic.com/v1/messages',
                    headers={
                        'Content-Type': 'application/json',
                        'x-api-key': api_key,
                        'anthropic-version': '2023-06-01',
                    },
                    json={
                        'model': 'claude-sonnet-4-20250514',
                        'max_tokens': 600,
                        'system': system,
                        'messages': [{'role': 'user', 'content': user_content}]
                    },
                    timeout=30,
                )
                data = resp.json()
                if 'content' in data:
                    text = ''.join(b.get('text', '') for b in data['content'] if b.get('type') == 'text')
                    if text:
                        return Response({'result': text})
            except Exception:
                pass

        return Response({'result': self.mock_response(tool_id, values)})

    def build_user_content(self, tool_id, values):
        if tool_id == 'translate':
            lang = values.get('trans_lang', 'French')
            text = values.get('trans_input', '')
            return f"Translate the following text into {lang}:\n\n{text}"
        return values.get('tagline_input') or values.get('email_input') or values.get('sum_input') or values.get('idea_input') or values.get('plan_input') or ''

    def mock_response(self, tool_id, values):
        prompts = {
            'tagline': '1. Automate Your Future\n2. Intelligence, Delivered Daily\n3. Where Tech Meets Trust',
            'email': 'Subject: Quick follow-up on your automation proposal\n\nHi,\n\nI wanted to circle back on the proposal we sent last week. If you have any questions or need adjustments, I am happy to hop on a quick call.\n\nBest regards',
            'summarize': '• The project aims to streamline business operations through AI-driven automation.\n• Key benefits include reduced manual work, faster response times, and improved accuracy.\n• Implementation is planned in phases over the coming weeks.',
            'translate': '[Translation will appear here when connected to a live AI model]',
            'idea': 'An AI ordering assistant for small restaurants that handles phone and WhatsApp orders, suggests upsells based on the time of day, and feeds orders directly into the kitchen display system. This reduces missed calls by half and increases average order value by 15-20%.',
            'plan': '1. Map the current order flow and identify touchpoints.\n2. Connect the AI voice agent to your POS and calendar.\n3. Train the AI on your menu and common requests.\n4. Run a two-week pilot with staff feedback.\n5. Refine scripts and upsell logic.\n6. Go live with monitoring and weekly reviews.',
        }
        return prompts.get(tool_id, 'Response generated by AutoMindAi demo engine.')


AURA_SYSTEM_PROMPT = """You are AURA, the warm, friendly AI assistant for AutoMindAi — a premium AI automation agency based in Tunisia.

Your personality:
- You are genuinely helpful, curious, and conversational — like a knowledgeable friend who happens to be an expert in AI automation.
- You speak naturally, like a real person would in a casual chat — not like a corporate bot reciting scripts.
- You are enthusiastic about helping people solve their problems with AI.
- You remember context from the conversation and build on it naturally.
- You ask clarifying questions when you need more info, just like a human consultant would.

Your capabilities — AutoMindAi offers:
1. AI Automation — connect tools, automate repetitive work, workflows, CRM/ERP integration
2. AI Chatbots — 24/7 customer support chatbots trained on their docs
3. AI Voice Agents — phone calls answered, appointments booked, calls transcribed
4. AI Agents — autonomous agents that complete multi-step tasks
5. Website Development — fast, modern, SEO-optimized sites
6. Software Development — custom internal tools and dashboards
7. Mobile App Development — iOS and Android apps
8. Industrial Automation — PLC, sensors, IoT dashboards, predictive maintenance
9. AI Marketing Systems — campaigns that write, target, and optimize themselves
10. AI Customer Support — instant responses, sentiment analysis, ticket deflection
11. AI Consulting — clear roadmaps and ROI analysis
12. Workflow Automation — eliminate manual handoffs
13. CRM Automation — lead scoring, routing, follow-up sequences
14. ERP Systems — unified inventory, finance, operations

Languages: You MUST automatically detect and reply in whatever language the user writes in — English, French, Arabic, German, Spanish, or any other language. If they mix languages, match their energy and switch naturally.

Guidelines:
- Keep replies concise (2-4 sentences usually) but warm and helpful.
- If someone describes a problem, suggest which AutoMindAi service could help.
- Give rough ballpark estimates when asked (chatbot starter ~800 TND, full platform ~5,000+ TND), but always clarify it's a rough range and they should book a free consultation for an exact quote.
- Typical timeline: 3-10 weeks for most projects, rush option 2-4 weeks.
- If they want to book, guide them to the consultation form on the site or say you can connect them.
- NEVER make up client names, case studies, or guaranteed results.
- If asked something unrelated, briefly redirect to how AutoMindAi can help them.
- Be encouraging — most clients see 20-50% time savings within the first month.

Start every new conversation with a warm, friendly greeting in the user's language."""

class ChatView(APIView):
    def post(self, request):
        message = request.data.get('message', '')
        history = request.data.get('history', [])

        api_key = getattr(settings, 'ANTHROPIC_API_KEY', '')

        if api_key:
            try:
                reply = self.get_claude_reply(message, history, api_key)
            except Exception:
                reply = self.get_fallback_reply(message, history)
        else:
            reply = self.get_fallback_reply(message, history)

        new_history = (history[-10:] if history else []) + [
            {'role': 'user', 'content': message},
            {'role': 'assistant', 'content': reply}
        ]

        return Response({'reply': reply, 'history': new_history})

    def get_claude_reply(self, message, history, api_key):
        import requests as req
        messages = []
        for h in (history[-8:] if history else []):
            messages.append({'role': h['role'], 'content': h['content']})
        messages.append({'role': 'user', 'content': message})

        resp = req.post(
            'https://api.anthropic.com/v1/messages',
            headers={
                'Content-Type': 'application/json',
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01',
            },
            json={
                'model': 'claude-sonnet-4-20250514',
                'max_tokens': 500,
                'system': AURA_SYSTEM_PROMPT,
                'messages': messages,
            },
            timeout=30,
        )
        data = resp.json()
        if 'content' in data:
            text = ''.join(b.get('text', '') for b in data['content'] if b.get('type') == 'text')
            if text.strip():
                return text.strip()
        return self.get_fallback_reply(message, history)

    def get_fallback_reply(self, message, history):
        msg = message.lower().strip()
        if not msg:
            return "Hey! 👋 I'm AURA — your AutoMindAi assistant. What are you working on today? I'd love to help you figure out how AI can make your life easier."

        user_lang = self.detect_language(msg)

        if any(w in msg for w in ['hello', 'hi', 'hey', 'bonjour', 'salut', 'مرحبا', 'hola', 'hallo', 'ciao', 'olá', 'привет']):
            return self.greeting(user_lang)

        if any(w in msg for w in ['price', 'cost', 'budget', 'quote', 'estimate', 'how much', 'prix', 'تكلفة', 'costo', 'preço']):
            return "Great question! A rough ballpark: a chatbot starter is around 800 TND, while a full AI platform runs 5,000+ TND. It really depends on what you're trying to automate. Want to tell me more about your project so I can give you a better sense of where you'd land?"

        if any(w in msg for w in ['service', 'services', 'offer', 'do you do', 'what do you', 'what can you', 'que faites', 'ماذا تفعل', 'servicios', 'serviços']):
            return "We do a lot of cool stuff! AI automation, chatbots, voice agents, websites, mobile apps, even industrial stuff like PLC and IoT dashboards. What's the part of your business that feels most manual or repetitive right now?"

        if any(w in msg for w in ['time', 'timeline', 'how long', 'weeks', 'duration', 'temps', 'وقت', 'tiempo']):
            return "Most of our projects go live in 3–10 weeks. If you're in a hurry, we can rush things to 2–4 weeks. It really depends on scope — want to share what you're trying to build?"

        if any(w in msg for w in ['contact', 'consultation', 'book', 'meeting', 'talk to someone', 'human', 'contacter', 'اتصل', 'contacto']):
            return "Absolutely! The best next step is a free consultation — just scroll down to the form on this page and drop your info, or tell me a bit about your project right here and I'll make sure our team follows up fast."

        if any(w in msg for w in ['chatbot', 'chat bot', 'chat', 'support', 'customer service']):
            return "Chatbots are one of our specialties! We build them trained specifically on your docs, FAQs, and policies. They handle English, French, Arabic, and German — and they hand off to a human seamlessly when needed. Are you looking to deflect support tickets or something else?"

        if any(w in msg for w in ['automation', 'workflow', 'crm', 'erp', 'integrate', 'api']):
            return "Automation is where we really shine. We connect the tools you already use — CRM, email, Slack, your ERP, you name it — and build workflows that run themselves. What manual process is eating up your team's time?"

        if any(w in msg for w in ['industrial', 'factory', 'sensor', 'plc', 'manufacturing', 'usine', 'مصنع', 'fábrica']):
            return "Industrial automation is huge for us. We do PLC integration, IoT sensor dashboards, predictive maintenance — the whole nine yards. Are you looking to modernize a specific line or system?"

        if any(w in msg for w in ['web', 'website', 'site', 'app', 'mobile', 'ios', 'android', 'site web', 'تطبيق', 'sitio']):
            return "We build fast, modern websites and mobile apps designed to convert visitors into customers. Want something that works great on mobile from day one? That's kind of our thing."

        if any(w in msg for w in ['language', 'languages', 'english', 'french', 'arabic', 'german', 'spanish', 'langue', 'لغة', 'idioma']):
            return "I'm fully multilingual! I can chat in English, French, Arabic, German, Spanish, and more — just speak naturally and I'll match you. What's most comfortable for you?"

        if any(w in msg for w in ['thank', 'thanks', 'merci', 'شكرا', 'gracias', 'danke']):
            return "You're welcome! 😊 Is there anything else I can help with? I'm here all day — literally, 24/7 just like our bots."

        if any(w in msg for w in ['bye', 'goodbye', 'see you', 'au revoir', 'مع السلامة', 'adiós', 'tchao']):
            return "Take care! Feel free to come back anytime. Have a great day! 👋"

        if any(w in msg for w in ['who', 'what is automind', 'about', 'tell me about', 'qui êtes', 'من أنتم', 'quienes son']):
            return "AutoMindAi is a Tunisia-based AI automation agency. We build AI systems that work 24/7 so teams can focus on growing the business instead of repeating tasks. Pretty cool, right? What are you curious about?"

        context_aware = self.get_contextual_reply(msg, history)
        if context_aware:
            return context_aware

        return self.general_chitchat(msg, user_lang)

    def detect_language(self, msg):
        import re
        arabic_chars = sum(1 for c in msg if '\u0600' <= c <= '\u06FF')
        french_words = ['bonjour', 'salut', 'merci', 'comment', 'pourquoi', 'quoi', 'daccord', "d'accord", 'êtes', 'vous', 'prix', 'temps', 'service', 'ça', 'veux', 'bien', 'merci', 'daccord']
        spanish_words = ['hola', 'gracias', 'por', 'favor', 'cómo', 'qué', 'precio', 'servicio', 'tiempo', 'buenos', 'días', 'noche']
        german_words = ['hallo', 'danke', 'preis', 'zeit', 'service', 'sprache', 'guten', 'tag', 'wie', 'kann']
        
        words = set(re.findall(r'\b\w+\b', msg.lower()))
        
        if arabic_chars > len(msg) * 0.3:
            return 'ar'
        if any(w in words for w in french_words):
            return 'fr'
        if any(w in words for w in spanish_words):
            return 'es'
        if any(w in words for w in german_words):
            return 'de'
        return 'en'

    def greeting(self, lang):
        greetings = {
            'en': "Hey! 👋 I'm AURA — your AutoMindAi assistant. What are you working on today? I'd love to help you figure out how AI can make your life easier.",
            'fr': "Salut ! 👋 Je suis AURA, l'assistant d'AutoMindAi. Qu'est-ce que tu essaies d'améliorer aujourd'hui ?",
            'ar': "مرحبا! 👋 أنا AURA مساعد AutoMindAi. ما الذي تعمل عليه اليوم؟ أحب أن أساعدك في اكتشاف كيف يمكن للذكاء الاصطناعي أن يسهل عملك.",
            'de': "Hallo! 👋 Ich bin AURA, dein AutoMindAi-Assistent. Woran arbeitest du heute? Ich helfe dir gerne, herauszufinden, wie KI deine Arbeit erleichtern kann.",
            'es': "¡Hola! 👋 Soy AURA, tu asistente de AutoMindAi. ¿En qué estás trabajando hoy? Me encantaría ayudarte a descubrir cómo la IA puede facilitarte la vida.",
        }
        return greetings.get(lang, greetings['en'])

    def get_contextual_reply(self, msg, history):
        prev = [h['content'].lower() for h in (history or []) if h.get('role') == 'user']
        if any('crm' in p or 'lead' in p for p in prev):
            if any(w in msg for w in ['yes', 'yeah', 'sure', 'ok', 'okay', 'oui', 'نعم', 'sí', 'ja']):
                return "Love it! For CRM and lead management, our automation handles scoring, routing, and follow-ups without you lifting a finger. Want me to sketch out what that would look like for your setup?"
        if any('chatbot' in p or 'chat' in p for p in prev):
            if any(w in msg for w in ['yes', 'yeah', 'sure', 'ok', 'okay', 'oui', 'نعم', 'sí', 'ja']):
                return "Awesome. We'd train the chatbot on your actual docs and FAQs, connect it to your helpdesk, and it'd be multilingual from day one. What's your current support situation like?"
        return None

    def general_chitchat(self, msg, lang):
        responses = {
            'en': [
                "I'm here to help! Whether you're curious about AI automation, chatbots, or just wondering if there's a better way to run your business — let's chat. What's on your mind?",
                "That's a great start. Tell me more about what you're trying to solve — I can point you toward the right AutoMindAi service.",
                "I hear you! A lot of our clients felt the same way before discovering how much time AI can save them. What feels most manual or tedious in your workflow?",
                "Interesting! I'd love to help you explore that. AutoMindAi has built solutions for healthcare, restaurants, real estate, logistics, manufacturing, education, and finance. Which industry are you in?",
                "No problem at all — that's what I'm here for! Think of me as your guide to figuring out where AI can actually move the needle for your business. What's the most frustrating part of your day right now?",
            ],
            'fr': [
                "Je suis là pour t'aider ! Que tu sois curieux à propos de l'automatisation IA, des chatbots, ou que tu cherches simplement un meilleur moyen de faire fonctionner ton entreprise — discutons !",
                "Bien dit ! Dis-m'en plus sur ce que tu essaies de résoudre — je peux teorienter vers le bon service AutoMindAi.",
                "Je comprends ! Beaucoup de nos clients ressentaient la même chose avant de découvrir le temps que l'IA peut leur faire gagner. Quelle partie de ton flux de travail te semble la plus manuelle ?",
            ],
            'ar': [
                "أنا هنا للمساعدة! سواء كنت فضوليًا حول الأتمتة بالذكاء الاصطناعي أو الدردشة الآلية أو تتساءل فقط عن طريقة أفضل لتشغيل عملك — دعنا نتحدث!",
                "أخبرني المزيد عن المشكلة التي تحاول حلها — يمكنني توجيهك إلى الخدمة المناسبة من AutoMindAi.",
                "أتفهمك! الكثير من عملائنا كانوا يشعرون بنفس الشيء قبل أن يكتشفوا مقدار الوقت الذي يمكن للذكاء الاصطناعي توفيره لهم. ما هي الجزء الأكثر تكرارًا في عملك اليومي؟",
            ],
            'de': [
                "Ich bin hier, um zu helfen! Egal, ob du neugierig auf KI-Automatisierung, Chatbots bist oder einfach nach einem besseren Weg suchst — lass uns reden!",
            ],
            'es': [
                "¡Estoy aquí para ayudar! Ya sea que tengas curiosidad sobre automatización con IA, chatbots, o sólo quieras encontrar una mejor manera de gestionar tu negocio — ¡hablemos!",
            ],
        }
        return random.choice(responses.get(lang, responses['en']))


AILAB_SYSTEM_PROMPT = """You are AURA's AI Lab engine. Given a business name, industry, and challenge, generate a complete personalized AI solution blueprint.

Return ONLY valid JSON with this exact structure:
{
  "solution_name": "Catchy AI solution name (e.g. 'NexusAI', 'FlowMind', 'CoreSync')",
  "tagline": "One powerful sentence describing the solution",
  "summary": "2-3 sentence executive summary of the AI solution",
  "core_capabilities": ["capability 1", "capability 2", "capability 3", "capability 4"],
  "ai_architecture": ["Component 1: description", "Component 2: description", "Component 3: description"],
  "roi_projection": "Estimated monthly time/cost savings as a percentage or TND amount",
  "implementation_weeks": "X-Y weeks",
  "team_workflow": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "tech_stack": ["Tech 1", "Tech 2", "Tech 3"],
  "pricing_tier": "starter|growth|enterprise",
  "estimated_cost_tnd": 1234
}

Rules:
- Be specific to their industry and challenge
- solution_name should sound like a real AI product
- core_capabilities should be 4-5 concrete AI features
- ai_architecture should describe how the AI system is built
- team_workflow should describe how their team will use it daily
- tech_stack should list 3-4 relevant technologies
- estimated_cost_tnd should be a realistic integer estimate in TND based on scope
- implementation_weeks should be realistic (3-10 weeks range)
- Return ONLY JSON, no extra text"""

SERVICE_NAMES = ['Nexus','Flow','Core','Mind','Pulse','Spark','Wave','Hub','Sync','Apex','Vera','Luma','Ora','Zent']
SERVICE_NOUNS = ['AI','Mind','Flow','Sync','Hub','Pulse','Core','Nexus','Wave','Spark']

def generate_solution_name(industry):
    prefix = random.choice(SERVICE_NOUNS)
    suffix = random.choice(SERVICE_NAMES)
    connectors = ['','AI','.ai','+']
    conn = random.choice(connectors)
    if conn:
        return f"{prefix}{conn}{suffix}"
    return f"{prefix}{suffix}"

class AILabView(APIView):
    def post(self, request):
        business_name = request.data.get('business_name', '').strip()
        industry = request.data.get('industry', '').strip()
        challenge = request.data.get('challenge', '').strip()

        if not all([business_name, industry, challenge]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = getattr(settings, 'ANTHROPIC_API_KEY', '')

        if api_key:
            try:
                result = self.get_claude_solution(business_name, industry, challenge, api_key)
            except Exception:
                result = self.get_fallback_solution(business_name, industry, challenge)
        else:
            result = self.get_fallback_solution(business_name, industry, challenge)

        result['business_name'] = business_name
        result['industry'] = industry
        result['challenge'] = challenge

        return Response(result)

    def get_claude_solution(self, business_name, industry, challenge, api_key):
        import requests as req
        user_message = f"Business: {business_name}\nIndustry: {industry}\nBiggest Challenge: {challenge}\n\nGenerate their personalized AI solution blueprint."

        resp = req.post(
            'https://api.anthropic.com/v1/messages',
            headers={
                'Content-Type': 'application/json',
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01',
            },
            json={
                'model': 'claude-sonnet-4-20250514',
                'max_tokens': 1200,
                'system': AILAB_SYSTEM_PROMPT,
                'messages': [{'role': 'user', 'content': user_message}],
            },
            timeout=45,
        )
        data = resp.json()
        if 'content' in data:
            text = ''.join(b.get('text', '') for b in data['content'] if b.get('type') == 'text')
            text = text.strip()
            if text.startswith('```'):
                text = text.split('\n', 1)[-1]
                if text.endswith('```'):
                    text = text[:-3]
            try:
                parsed = json.loads(text)
                if parsed.get('solution_name'):
                    return parsed
            except json.JSONDecodeError:
                pass
        return self.get_fallback_solution(business_name, industry, challenge)

    def get_fallback_solution(self, business_name, industry, challenge):
        industry_lower = industry.lower()
        challenge_lower = challenge.lower()

        if any(w in industry_lower for w in ['restaurant', 'cafe', 'food', 'hotel', 'hospitality']):
            svc_type = 'restaurant'
        elif any(w in industry_lower for w in ['health', 'medical', 'clinic', 'hospital', 'pharma']):
            svc_type = 'healthcare'
        elif any(w in industry_lower for w in ['real estate', 'property', 'immobilier', 'عقارات']):
            svc_type = 'realestate'
        elif any(w in industry_lower for w in ['ecommerce', 'shop', 'retail', 'store', 'تجارة']):
            svc_type = 'ecommerce'
        elif any(w in industry_lower for w in ['logistics', 'shipping', 'transport', 'نقل']):
            svc_type = 'logistics'
        elif any(w in industry_lower for w in ['manufacturing', 'factory', 'مصنع', 'industrie']):
            svc_type = 'manufacturing'
        elif any(w in industry_lower for w in ['education', 'school', 'university', 'تعليم']):
            svc_type = 'education'
        elif any(w in industry_lower for w in ['finance', 'bank', 'insurance', 'مالية']):
            svc_type = 'finance'
        else:
            svc_type = 'general'

        templates = {
            'restaurant': {
                'name': 'AutoServe.ai',
                'tagline': f'AI-powered restaurant operations for {business_name}',
                'summary': f'A complete AI operations system designed for {business_name}. It handles voice ordering, table bookings, inventory predictions, and staff scheduling — so your team can focus on food and guests, not admin.',
                'capabilities': ['Voice Ordering Agent (24/7 phone line)', 'Smart Reservation System', 'Inventory Prediction Engine', 'Customer Feedback Analyzer', 'Peak-Hours Staff Scheduler'],
                'architecture': ['Voice AI Gateway → POS System', 'NLP Engine → Menu & Inventory DB', 'Predictive Model → Supply Orders', 'Analytics Dashboard → Manager Alerts'],
                'roi': '↓ 35% missed calls · ↑ 20% order volume · 24/7 coverage',
                'weeks': '4–6 weeks',
                'workflow': ['Customer calls → AI takes order → POS updates', 'AI predicts busy periods → auto-adjusts staffing', 'End of day → AI generates sales report', 'Weekly → AI suggests menu optimizations'],
                'stack': ['Voice AI', 'POS Integration', 'NLP Engine', 'Analytics Dashboard'],
                'tier': 'growth',
                'cost': 3200,
            },
            'healthcare': {
                'name': 'MediFlow.ai',
                'tagline': f'AI patient management for {business_name}',
                'summary': f'An intelligent patient management system for {business_name}. It handles appointment scheduling, automated reminders, intake forms, and basic triage — reducing no-shows and freeing up staff for what matters.',
                'capabilities': ['Smart Appointment Scheduler', 'Multilingual Patient Assistant', 'Automated Reminder System (SMS/WhatsApp)', 'Intake Form Automation', 'Triage & Routing Bot'],
                'architecture': ['Patient Chatbot → Calendar API', 'NLP Engine → Medical KB', 'Reminder Engine → SMS/WhatsApp API', 'Dashboard → Admin Panel'],
                'roi': '↓ 40% no-shows · ↓ 15h admin/week · <1min response time',
                'weeks': '4–7 weeks',
                'workflow': ['Patient messages → AI answers instantly', 'AI books/reschedules → calendar updates', 'Day before → AI sends reminder', 'Clinic dashboard → real-time stats'],
                'stack': ['Chatbot NLU', 'Calendar API', 'SMS Gateway', 'Health Dashboard'],
                'tier': 'growth',
                'cost': 3800,
            },
            'realestate': {
                'name': 'PropMind.ai',
                'tagline': f'AI lead qualification for {business_name}',
                'summary': f'An AI lead management system for {business_name}. It qualifies inbound inquiries instantly, schedules viewings, and follows up with leads — 24/7. Never let a hot lead go cold again.',
                'capabilities': ['Lead Qualification Agent', 'Auto Viewing Scheduler', 'Follow-up Sequence Engine', 'Multi-channel Lead Capture', 'Client Matching Algorithm'],
                'architecture': ['Lead Capture → Scoring Engine', 'Chatbot → CRM Integration', 'Calendar AI → Agent Schedules', 'Analytics → Lead Dashboard'],
                'roi': '↑ 3x qualified viewings · <2min first response · 24/7 coverage',
                'weeks': '3–5 weeks',
                'workflow': ['Lead arrives → AI scores & qualifies', 'Hot lead → AI books viewing instantly', '48h follow-up → AI sends personalized email', 'Weekly → AI report on lead quality'],
                'stack': ['Lead Scoring AI', 'CRM Webhooks', 'Calendar API', 'Email Automation'],
                'tier': 'starter',
                'cost': 2400,
            },
            'ecommerce': {
                'name': 'CartPilot.ai',
                'tagline': f'AI ecommerce optimization for {business_name}',
                'summary': f'An AI commerce system for {business_name}. It recovers abandoned carts with smart messaging, provides 24/7 customer support, and optimizes product recommendations — turning browsers into buyers.',
                'capabilities': ['Cart Recovery Agent', 'AI Product Recommender', '24/7 Support Chatbot', 'Smart Search Engine', 'Review Sentiment Analyzer'],
                'architecture': ['Cart Tracker → Recovery Engine', 'NLP → Support Knowledge Base', 'Recommendation AI → Product DB', 'Analytics → Sales Dashboard'],
                'roi': '↓ 25% cart abandonment · ↑ 15% conversion · 24/7 support coverage',
                'weeks': '3–6 weeks',
                'workflow': ['Cart abandoned → AI sends recovery sequence', 'Customer questions → AI answers instantly', 'Daily → AI suggests top products to promote', 'Weekly → AI optimization report'],
                'stack': ['NLP Engine', 'E-commerce API', 'Email Automation', 'Analytics AI'],
                'tier': 'growth',
                'cost': 3500,
            },
            'logistics': {
                'name': 'RoutePilot.ai',
                'tagline': f'AI logistics optimization for {business_name}',
                'summary': f'An intelligent logistics system for {business_name}. It optimizes routes in real time, predicts delays, and automates dispatch — cutting fuel costs and improving delivery times.',
                'capabilities': ['Real-time Route Optimizer', 'Delay Prediction Engine', 'Auto Dispatch System', 'Fleet Health Monitor', 'Customer ETA Notifier'],
                'architecture': ['GPS Data → Route Engine', 'Traffic AI → ETA Predictor', 'Dispatch Bot → Driver App', 'Dashboard → Operations Center'],
                'roi': '↓ 15% fuel costs · ↑ On-time deliveries · Real-time visibility',
                'weeks': '5–8 weeks',
                'workflow': ['Morning → AI generates optimal routes', 'Traffic incident → AI re-routes instantly', 'Delivery complete → AI confirms & notifies', 'Daily → AI ops summary report'],
                'stack': ['Routing AI', 'Maps API', 'IoT Trackers', 'Fleet Dashboard'],
                'tier': 'enterprise',
                'cost': 5000,
            },
            'manufacturing': {
                'name': 'ForgeMind.ai',
                'tagline': f'AI manufacturing intelligence for {business_name}',
                'summary': f'A predictive manufacturing system for {business_name}. It monitors equipment health, predicts failures before they happen, and optimizes production schedules — reducing downtime and improving quality.',
                'capabilities': ['Predictive Maintenance AI', 'Quality Control Vision System', 'Production Optimizer', 'Supply Chain Predictor', 'Safety Monitoring Agent'],
                'architecture': ['IoT Sensors → Anomaly Detector', 'Computer Vision → QC Station', 'ML Model → Maintenance Alerts', 'Dashboard → Factory Floor'],
                'roi': '↓ 30% unplanned downtime · ↑ Quality yield · Predictive alerts',
                'weeks': '6–10 weeks',
                'workflow': ['Sensors stream → AI monitors 24/7', 'Anomaly detected → AI alerts & suggests fix', 'AI optimizes production schedule daily', 'Weekly → AI quality & efficiency report'],
                'stack': ['IoT Platform', 'ML Anomaly Detection', 'Computer Vision', 'Industrial Dashboard'],
                'tier': 'enterprise',
                'cost': 5000,
            },
            'education': {
                'name': 'EduPilot.ai',
                'tagline': f'AI education assistant for {business_name}',
                'summary': f'An AI education platform for {business_name}. It handles applicant inquiries 24/7, automates admissions follow-ups, and personalizes student communication — freeing your team from repetitive questions.',
                'capabilities': ['Admissions Chatbot (24/7)', 'Applicant Auto-Follow-up', 'Document Processing AI', 'FAQ Knowledge Base', 'Student Progress Tracker'],
                'architecture': ['Chatbot → Admissions DB', 'NLP → FAQ + Policy KB', 'Doc AI → PDF Processing', 'Dashboard → Admin Panel'],
                'roi': '24/7 coverage · ↓ 60% repetitive inquiries · Faster turnaround',
                'weeks': '4–6 weeks',
                'workflow': ['Applicant arrives → AI answers instantly', 'AI collects info → updates admissions DB', 'Deadline approaching → AI sends reminder', 'Weekly → AI admissions analytics'],
                'stack': ['Chatbot NLU', 'Doc Processing AI', 'CRM Integration', 'EdTech Dashboard'],
                'tier': 'growth',
                'cost': 2800,
            },
            'finance': {
                'name': 'LedgerMind.ai',
                'tagline': f'AI financial automation for {business_name}',
                'summary': f'An AI financial operations system for {business_name}. It automates document processing, detects fraud in real-time, and generates instant financial reports — reducing manual work and improving accuracy.',
                'capabilities': ['Document Extraction AI', 'Real-time Fraud Detection', 'Auto Bookkeeping Engine', 'Compliance Monitor', 'Financial Report Generator'],
                'architecture': ['Doc AI → Accounting System', 'Anomaly Detector → Alert Engine', 'ML Model → Transaction DB', 'BI Dashboard → Finance Team'],
                'roi': '↓ 70% manual data entry · Real-time fraud alerts · Faster reporting',
                'weeks': '5–8 weeks',
                'workflow': ['Invoice received → AI extracts data', 'Transaction flagged → AI alerts instantly', 'End of day → AI categorizes & logs', 'Monthly → AI generates financial report'],
                'stack': ['OCR + NLP AI', 'Anomaly Detection ML', 'Accounting API', 'BI Dashboard'],
                'tier': 'enterprise',
                'cost': 4500,
            },
            'general': {
                'name': f'{random.choice(["Auto","Smart","Intelli","Deep","Neo"])}{random.choice(["Flow","Mind","Pilot","Hub","Core"])}.ai',
                'tagline': f'Custom AI solution for {business_name}',
                'summary': f'A tailored AI automation system for {business_name} in the {industry} space. Based on your challenge — {challenge} — we\'ll build a system that automates the repetitive work, integrates with your existing tools, and runs 24/7.',
                'capabilities': ['Intelligent Process Automation', 'Smart Data Processing', 'Predictive Analytics Engine', '24/7 Monitoring & Alerts', 'Custom Dashboard & Reports'],
                'architecture': ['Data Collection Layer → AI Processing Engine', 'ML Models → Decision Layer', 'API Gateway → Your Tools', 'Analytics Dashboard → Your Team'],
                'roi': '↓ 25-40% operational costs · 24/7 automation · Data-driven decisions',
                'weeks': '4–8 weeks',
                'workflow': ['AI monitors your processes continuously', 'Anomalies → AI takes action or alerts', 'Daily → AI generates performance insights', 'Monthly → AI optimization report'],
                'stack': ['AI/ML Engine', 'API Integrations', 'Cloud Infrastructure', 'Analytics Dashboard'],
                'tier': 'growth',
                'cost': 3200,
            },
        }

        t = templates[svc_type]
        name = t['name']
        if random.random() > 0.5:
            name = generate_solution_name(industry)

        return {
            'solution_name': name,
            'tagline': t['tagline'],
            'summary': t['summary'],
            'core_capabilities': t['capabilities'],
            'ai_architecture': t['architecture'],
            'roi_projection': t['roi'],
            'implementation_weeks': t['weeks'],
            'team_workflow': t['workflow'],
            'tech_stack': t['stack'],
            'pricing_tier': t['tier'],
            'estimated_cost_tnd': t['cost'] + random.randint(-200, 400),
        }
