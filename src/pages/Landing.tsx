import { Shield, Lock, Eye, CheckCircle, ArrowRight, Users, Timer, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Landing() {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "End-to-end encryption, secure proctoring, and comprehensive privacy protection for all assessments."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data is never shared. Complete GDPR compliance with transparent data handling practices."
    },
    {
      icon: Eye,
      title: "Smart Proctoring",
      description: "AI-powered monitoring that ensures exam integrity while respecting candidate privacy."
    },
    {
      icon: Timer,
      title: "Flexible Scheduling",
      description: "Take exams when convenient with secure time windows and automatic submission."
    },
    {
      icon: Users,
      title: "Multi-Role Support",
      description: "Comprehensive platform for candidates, administrators, and organization management."
    },
    {
      icon: Award,
      title: "Instant Results",
      description: "Get immediate feedback with detailed analytics and performance insights."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "100K+", label: "Secure Exams" },
    { value: "500+", label: "Companies" },
    { value: "Zero", label: "Data Breaches" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">SecureExam</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Login</Button>
            <Button variant="secure">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secure/10 text-secure rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Enterprise-Grade Security & Privacy
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              The Most Secure
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Exam Platform
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Conduct assessments with complete confidence. Advanced security, privacy protection, 
              and intelligent proctoring in one comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="exam" className="px-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Schedule Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                SOC 2 Type II Certified
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                GDPR Compliant
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                ISO 27001 Certified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose SecureExam?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for organizations that prioritize security, privacy, and reliability in their assessment processes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations already using SecureExam for their critical assessments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">SecureExam</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}