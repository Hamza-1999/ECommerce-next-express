import { Header } from "@/components/user/header"
import { Footer } from "@/components/user/footer"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Heart, Users, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Our Story</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Founded with a passion for empowering Muslim women through beautiful, high-quality hijabs that celebrate
              both tradition and contemporary style.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                At Hijab Collection, we believe that every woman deserves to feel confident, beautiful, and comfortable
                in her hijab. Our mission is to provide premium quality hijabs that honor Islamic values while embracing
                modern fashion sensibilities.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We carefully source the finest materials from around the world and work with skilled artisans to create
                hijabs that are not just beautiful, but also comfortable for everyday wear.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/elegant-chiffon-hijab.png"
                alt="Our Mission"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-800" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-slate-600">
                  We never compromise on quality, using only the finest materials and craftsmanship.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-800" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-slate-600">
                  Building a supportive community of women who celebrate their faith and style.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-amber-800" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-slate-600">
                  Striving for excellence in every aspect of our business and customer service.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-amber-800" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-slate-600">
                  Serving Muslim women worldwide with fast, reliable shipping and service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">The passionate individuals behind Hijab Collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Image
                  src="/professional-woman-founder.png"
                  alt="Founder"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Amina Hassan</h3>
                <p className="text-amber-800 mb-3">Founder & CEO</p>
                <p className="text-slate-600 text-sm">
                  Passionate about empowering women through beautiful, modest fashion.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Image
                  src="/professional-woman-designer.png"
                  alt="Designer"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Fatima Al-Zahra</h3>
                <p className="text-amber-800 mb-3">Head Designer</p>
                <p className="text-slate-600 text-sm">
                  Creates beautiful designs that blend tradition with contemporary style.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Image
                  src="/professional-woman-manager.png"
                  alt="Operations Manager"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Sarah Ahmed</h3>
                <p className="text-amber-800 mb-3">Operations Manager</p>
                <p className="text-slate-600 text-sm">
                  Ensures every order is fulfilled with care and attention to detail.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
