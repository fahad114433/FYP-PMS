import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContactMessageMutation } from '../redux/Api/dashboardSlice';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactMessage, { isLoading }] = useContactMessageMutation();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await contactMessage(formData);
      if (response?.message) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong");
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div {...fadeInUp} className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ready to collaborate? Let's discuss your project and bring your vision to life
          </p>
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div {...fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* About Section */}
          <motion.div {...fadeIn} className="group relative bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800">About Me</h4>
                <p className="text-sm text-slate-600">Project Manager & Developer</p>
              </div>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div {...fadeIn} className="group relative bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800">Email</h4>
                <p className="text-sm text-slate-600">contact@yourname.com</p>
              </div>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div {...fadeIn} className="group relative bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800">Phone</h4>
                <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div {...fadeIn} className="group relative bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800">Location</h4>
                <p className="text-sm text-slate-600">San Francisco, CA</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Office Hours */}
        <motion.div {...fadeInUp} className="mb-12">
          <motion.div {...fadeIn} className="group relative bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Office Hours</h3>
              </div>
              <div className="space-y-2">
                <p className="text-lg text-slate-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p className="text-slate-600">Weekend: By appointment</p>
                <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
                  I'm a passionate developer and project manager with expertise in creating innovative solutions
                  that drive business growth. Ready to transform your ideas into reality with cutting-edge technology.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Full Screen Contact Form */}
        <motion.div {...fadeInUp} className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Send Message</h3>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Let's discuss your project and bring your vision to life
            </p>
          </div>

          {isSubmitted ? (
            <motion.div {...fadeInUp} className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-4">Message Sent!</h4>
              <p className="text-lg text-slate-600 max-w-md mx-auto">Thank you for reaching out. I'll get back to you soon.</p>
            </motion.div>
          ) : (
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div>
                    <label className="block text-lg font-semibold text-slate-700 mb-4">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:shadow-md text-lg"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-lg font-semibold text-slate-700 mb-4">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:shadow-md text-lg"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="md:col-span-2 w-full">
                    <label className="block text-lg font-semibold text-slate-700 mb-4">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:shadow-md text-lg"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Empty div for spacing */}
                  <div></div>

                  {/* Message Field - Full Width */}
                  <div className="md:col-span-2">
                    <label className="block text-lg font-semibold text-slate-700 mb-4">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={8}
                      className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:shadow-md resize-none text-lg"
                      placeholder="Tell me about your project or inquiry..."
                    />
                  </div>

                  {/* Submit Button - Full Width */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="group/btn bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 text-base mx-auto"
                    >
                      <Send className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>

        {/* Additional Info Section */}
        <motion.div {...fadeInUp} className="mt-12 text-center">
          <motion.div {...fadeIn} className="group relative bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Let's Build Something Amazing Together
              </h3>
              <p className="text-slate-600 max-w-3xl mx-auto">
                I'm always excited to discuss new projects and opportunities. Whether you have a specific
                idea in mind or need guidance on your next digital venture, I'm here to help you succeed.
                Let's turn your vision into reality with innovative solutions and exceptional results.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;