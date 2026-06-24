from django.core.management.base import BaseCommand
from core.models import Service, Industry, Portfolio

SERVICES = [
    {"icon":"automation","title":"AI Automation","description":"Connect your tools and let AI handle the repetitive work.","bullets":["Maps your current manual process","Connects the tools you already use","Runs unattended, with monitoring built in"],"cover_gradient":"linear-gradient(135deg,#0057FF,#00A3FF)","order":0},
    {"icon":"agent","title":"AI Agents","description":"Autonomous agents that complete multi-step tasks on their own.","bullets":["Plans and executes multi-step tasks","Uses your internal tools and data safely","Escalates to a human when it's unsure"],"cover_gradient":"linear-gradient(135deg,#00102E,#0057FF)","order":1},
    {"icon":"chatbot","title":"AI Chatbots","description":"24/7 conversational support that actually resolves issues.","bullets":["Trained on your docs, FAQs and policies","Handles English, French, Arabic, German","Hands off to a human seamlessly"],"cover_gradient":"linear-gradient(135deg,#0057FF,#7fd2ff)","order":2},
    {"icon":"web","title":"Website Development","description":"Fast, modern sites built to convert visitors into customers.","bullets":["Built for speed and SEO from day one","Mobile-first, accessible by default","Easy for your team to update"],"cover_gradient":"linear-gradient(135deg,#001a4d,#00a3ff)","order":3},
    {"icon":"software","title":"Software Development","description":"Custom internal tools built around how your team works.","bullets":["Scoped around your actual workflow","Built on a stack your team can maintain","Includes admin tooling and logging"],"cover_gradient":"linear-gradient(135deg,#002266,#0088cc)","order":4},
    {"icon":"mobile","title":"Mobile App Development","description":"Native-feeling apps for iOS and Android.","bullets":["One codebase, both platforms","Push notifications and offline support","App store submission handled for you"],"cover_gradient":"linear-gradient(135deg,#001133,#0055aa)","order":5},
    {"icon":"industrial","title":"Industrial Automation","description":"Sensors, control systems and robotics for the factory floor.","bullets":["PLC and sensor integration","Real-time monitoring dashboards","Predictive maintenance alerts"],"cover_gradient":"linear-gradient(135deg,#003388,#00aaff)","order":6},
    {"icon":"consulting","title":"AI Consulting","description":"A clear roadmap for where AI actually moves the needle.","bullets":["Audit of your current operations","Prioritized automation roadmap","ROI estimate per opportunity"],"cover_gradient":"linear-gradient(135deg,#001f4d,#0099dd)","order":7},
    {"icon":"workflow","title":"Workflow Automation","description":"Eliminate manual handoffs between people and systems.","bullets":["Maps every handoff in the process","Removes duplicate data entry","Alerts the right person at the right time"],"cover_gradient":"linear-gradient(135deg,#004488,#00bbff)","order":8},
    {"icon":"crm","title":"CRM Automation","description":"Leads routed, scored and followed up without lifting a finger.","bullets":["Auto-scoring and routing of new leads","Follow-up sequences that adapt","Clean, de-duplicated contact data"],"cover_gradient":"linear-gradient(135deg,#001a33,#0066bb)","order":9},
    {"icon":"erp","title":"ERP Systems","description":"One system of record for inventory, finance and operations.","bullets":["Unifies inventory, finance and ops","Role-based access and audit trail","Reporting dashboards out of the box"],"cover_gradient":"linear-gradient(135deg,#002244,#0077cc)","order":10},
    {"icon":"support","title":"AI Customer Support","description":"Faster first response, fewer tickets escalated.","bullets":["Instant first response, any hour","Deflects repetitive tickets automatically","Surfaces sentiment and trends"],"cover_gradient":"linear-gradient(135deg,#001f5c,#0088dd)","order":11},
    {"icon":"marketing","title":"AI Marketing Systems","description":"Campaigns that write, target and optimize themselves.","bullets":["Drafts copy and creative variants","Targets and retargets automatically","Reports performance in plain language"],"cover_gradient":"linear-gradient(135deg,#003366,#0099ee)","order":12},
    {"icon":"voice","title":"AI Voice Agents","description":"Phone calls answered and routed by voice AI, any hour.","bullets":["Answers and routes calls 24/7","Books appointments over the phone","Transcribes and logs every call"],"cover_gradient":"linear-gradient(135deg,#001d4d,#0088cc)","order":13},
]

INDUSTRIES = [
    {"name":"Healthcare","before_text":"Staff buried in scheduling calls, no-shows pile up.","after_text":"AI handles intake, reminders and triage automatically.","stats":[["↓ 30–45%","No-show rate"],["8–12 hrs","Staff hours saved / week"],["< 1 min","Patient response time"]],"order":0},
    {"name":"Restaurants","before_text":"Orders missed during rush, inconsistent upsells.","after_text":"AI voice & chat take orders, upsell and book tables 24/7.","stats":[["+15–20%","Average order value"],["24/7","Order & booking coverage"],["↓ 50%","Missed calls during rush"]],"order":1},
    {"name":"Real Estate","before_text":"Inquiries go cold waiting for a callback.","after_text":"AI qualifies and books viewings the moment a lead comes in.","stats":[["< 1 min","First response time"],["↑ 2–3x","Qualified leads booked"],["24/7","Inquiry coverage"]],"order":2},
    {"name":"E-commerce","before_text":"Carts abandoned, support tickets pile up after hours.","after_text":"AI recovers carts and resolves tickets around the clock.","stats":[["↓ 20–30%","Cart abandonment"],["24/7","Support coverage"],["↓ 40%","Ticket backlog"]],"order":3},
    {"name":"Logistics","before_text":"Routes planned manually, delays found out too late.","after_text":"AI optimizes routes and flags delays before they cascade.","stats":[["↓ 12–18%","Fuel & route cost"],["Real-time","Delay alerts"],["↑ On-time","Delivery rate"]],"order":4},
    {"name":"Manufacturing","before_text":"Downtime discovered after the line has already stopped.","after_text":"AI flags maintenance needs before failure happens.","stats":[["↓ 25–35%","Unplanned downtime"],["Predictive","Maintenance alerts"],["↑ Quality","Defect catch rate"]],"order":5},
    {"name":"Education","before_text":"Admissions staff answer the same questions all day.","after_text":"AI answers applicant questions and routes edge cases.","stats":[["24/7","Applicant Q&A coverage"],["↓ 50%","Repetitive inquiries"],["Faster","Application turnaround"]],"order":6},
    {"name":"Finance","before_text":"Documents processed by hand, fraud flags found too late.","after_text":"AI extracts data and flags anomalies in real time.","stats":[["↓ 60–70%","Manual data entry"],["Real-time","Fraud flagging"],["Faster","Document turnaround"]],"order":7},
]

PORTFOLIO = [
    {"title":"Inventory Auto-Replenishment Agent","tag":"AI Automation","category":"automation","icon":"automation","description":"An agent that watches stock levels and reorders before shelves run empty.","stack":["Forecasting model","Supplier API","Slack alerts"],"order":0},
    {"title":"Clinic Intake & Reminder Chatbot","tag":"AI Chatbots","category":"chatbot","icon":"chatbot","description":"Handles intake forms, appointment reminders and FAQs for a multi-location clinic.","stack":["NLU","Calendar sync","SMS + WhatsApp"],"order":1},
    {"title":"Logistics Route Optimization Engine","tag":"AI Automation","category":"automation","icon":"workflow","description":"Re-plans delivery routes in real time as traffic and orders change.","stack":["Routing model","Live maps API","Driver app"],"order":2},
    {"title":"Restaurant Voice Ordering Line","tag":"AI Voice Agents","category":"chatbot","icon":"voice","description":"A phone line that takes orders, upsells and confirms pickup times.","stack":["Voice AI","POS integration","Order queue"],"order":3},
    {"title":"Real-Estate Lead Qualification Bot","tag":"AI Agents","category":"agent","icon":"agent","description":"Qualifies inbound leads and books viewings directly into agents' calendars.","stack":["Lead scoring","Calendar API","CRM sync"],"order":4},
    {"title":"Factory Floor Predictive Maintenance","tag":"Industrial Automation","category":"industrial","icon":"industrial","description":"Sensor data feeds a model that predicts failures before they happen.","stack":["IoT sensors","Anomaly detection","Dashboard"],"order":5},
    {"title":"CRM Auto-Routing Workflow","tag":"CRM Automation","category":"automation","icon":"crm","description":"New leads are scored, routed and followed up without manual triage.","stack":["Lead scoring","CRM webhooks","Email sequences"],"order":6},
    {"title":"Multilingual Support Agent","tag":"AI Customer Support","category":"chatbot","icon":"support","description":"One support agent fluent in English, French and Arabic, handling tickets end to end.","stack":["Multilingual NLU","Helpdesk API","Sentiment tagging"],"order":7},
]

class Command(BaseCommand):
    help = 'Seed initial data for AutoMindAi'

    def handle(self, *args, **options):
        self.stdout.write('Seeding services...')
        for item in SERVICES:
            Service.objects.get_or_create(title=item['title'], defaults=item)
        
        self.stdout.write('Seeding industries...')
        for item in INDUSTRIES:
            Industry.objects.get_or_create(name=item['name'], defaults=item)
        
        self.stdout.write('Seeding portfolio...')
        for item in PORTFOLIO:
            Portfolio.objects.get_or_create(title=item['title'], defaults=item)
        
        self.stdout.write(self.style.SUCCESS('Done!'))
