from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core import views, admin_api

router = DefaultRouter()
router.register(r'services', views.ServiceViewSet)
router.register(r'industries', views.IndustryViewSet)
router.register(r'portfolio', views.PortfolioViewSet)
router.register(r'contact', views.ContactSubmissionViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('estimate/', views.EstimateView.as_view(), name='estimate'),
    path('demo/', views.DemoView.as_view(), name='demo'),
    path('chat/', views.ChatView.as_view(), name='chat'),
    path('ai-lab/', views.AILabView.as_view(), name='ai-lab'),
    path('admin/login/', admin_api.AdminTokenObtainPairView.as_view(), name='admin-login'),
    path('admin/services/', admin_api.AdminServiceViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-services'),
    path('admin/services/<int:pk>/', admin_api.AdminServiceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-service-detail'),
    path('admin/industries/', admin_api.AdminIndustryViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-industries'),
    path('admin/industries/<int:pk>/', admin_api.AdminIndustryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-industry-detail'),
    path('admin/portfolio/', admin_api.AdminPortfolioViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-portfolio'),
    path('admin/portfolio/<int:pk>/', admin_api.AdminPortfolioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-portfolio-detail'),
    path('admin/submissions/', admin_api.AdminContactSubmissionViewSet.as_view({'get': 'list'}), name='admin-submissions'),
]
