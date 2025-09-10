"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function JoinNow() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: "",
    gmail: "",
    phone: "",
    linkedin: "",
    resume: "",
    role: "",
    developerWhy: "",
    developerGithub: "",
    developerExp: "",
    publicWhy: "",
    publicExamples: "",
    publicExp: "",
    creatorWhy: "",
    creatorPortfolio: "",
    creatorPlatformPref: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState("")
  const [completedFields, setCompletedFields] = useState(new Set())

  const roles = [
    { id: "developer", label: "Developer", icon: "💻", description: "Build amazing products" },
    { id: "public", label: "Public Reaction", icon: "🎭", description: "Shape public opinion" },
    { id: "creator", label: "Content Creator", icon: "🎨", description: "Create engaging content" },
  ]

  useEffect(() => {
    const newErrors = {}
    const completed = new Set()

    if (form.name) completed.add("name")
    else if (form.name === "" && focusedField !== "name") newErrors.name = "Name is required"

    if (form.gmail) {
      completed.add("gmail")
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.gmail)) {
        newErrors.gmail = "Please enter a valid email"
      }
    }

    if (form.phone) completed.add("phone")
    if (form.role) completed.add("role")

    setErrors(newErrors)
    setCompletedFields(completed)
  }, [form, focusedField])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function goToRolePage() {
    if (!form.name || !form.gmail || !form.phone || !form.role) {
      alert("Please fill Name, Gmail, Phone and pick a Role before continuing.")
      return
    }
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare form data for FormSubmit
      const formData = new FormData()

      // Basic info
      formData.append("name", form.name)
      formData.append("email", form.gmail)
      formData.append("phone", form.phone)
      formData.append("linkedin", form.linkedin || "Not provided")
      formData.append("resume", form.resume || "Not provided")
      formData.append("role", roleLabel(form.role))

      // Role-specific fields
      if (form.role === "developer") {
        formData.append("why_developer", form.developerWhy)
        formData.append("github", form.developerGithub)
        formData.append("developer_experience", form.developerExp)
      } else if (form.role === "public") {
        formData.append("why_public", form.publicWhy)
        formData.append("campaign_examples", form.publicExamples)
        formData.append("public_experience", form.publicExp)
      } else if (form.role === "creator") {
        formData.append("why_creator", form.creatorWhy)
        formData.append("portfolio", form.creatorPortfolio)
        formData.append("preferred_platforms", form.creatorPlatformPref)
      }

      // FormSubmit configuration
      formData.append("_subject", `NETWORTHWARS Internship Application - ${form.name} (${roleLabel(form.role)})`)
      formData.append("_captcha", "false")
      formData.append("_template", "table")

      const response = await fetch("https://formsubmit.co/ccidcop@gmail.com", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setStep(3)
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress =
    step === 1 ? (Object.values(form).filter((v) => v).length / Object.keys(form).length) * 50 : step === 2 ? 75 : 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 relative overflow-hidden">
      <EnhancedAnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-4xl w-full px-6 py-10"
      >
        <div className="mx-auto rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-10 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          {step !== 3 && (
            <motion.header
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Join NETWORTHWARS</h1>
                <p className="text-sm text-white/70 mt-1">Internship Application</p>
                <div className="mt-3 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">{Math.round(progress)}% complete</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/60">Step {step} of 3</span>
              </div>
            </motion.header>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl p-6 bg-gradient-to-b from-black/40 to-black/20 border border-white/10"
              >
                <MainForm
                  form={form}
                  onChange={handleChange}
                  roles={roles}
                  onNext={goToRolePage}
                  errors={errors}
                  completedFields={completedFields}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl p-6 bg-gradient-to-b from-black/40 to-black/20 border border-white/10"
              >
                <RoleForm
                  form={form}
                  onChange={handleChange}
                  onBack={() => setStep(1)}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ThankYou name={form.name} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <footer className="absolute bottom-6 text-center w-full z-10 text-white/50 text-xs">
        NETWORTHWARS © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

function MainForm({ form, onChange, roles, onNext, errors, completedFields, focusedField, setFocusedField }) {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <EnhancedField
        label="Full Name"
        id="name"
        error={errors.name}
        completed={completedFields.has("name")}
        focused={focusedField === "name"}
      >
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField("")}
          placeholder="Jane Doe"
          className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
        />
      </EnhancedField>

      <EnhancedField
        label="Gmail"
        id="gmail"
        error={errors.gmail}
        completed={completedFields.has("gmail")}
        focused={focusedField === "gmail"}
      >
        <input
          name="gmail"
          value={form.gmail}
          onChange={onChange}
          onFocus={() => setFocusedField("gmail")}
          onBlur={() => setFocusedField("")}
          placeholder="you@gmail.com"
          type="email"
          className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
        />
      </EnhancedField>

      <EnhancedField
        label="Phone No"
        id="phone"
        completed={completedFields.has("phone")}
        focused={focusedField === "phone"}
      >
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          onFocus={() => setFocusedField("phone")}
          onBlur={() => setFocusedField("")}
          placeholder="+91 99999 99999"
          className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
        />
      </EnhancedField>

      <EnhancedField label="LinkedIn Profile (optional)" id="linkedin">
        <input
          name="linkedin"
          value={form.linkedin}
          onChange={onChange}
          placeholder="https://www.linkedin.com/in/yourname"
          className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
        />
      </EnhancedField>

      <EnhancedField label="Resume URL (optional)" id="resume">
        <input
          name="resume"
          value={form.resume}
          onChange={onChange}
          placeholder="https://drive.google.com/.."
          className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
        />
      </EnhancedField>

      <div>
        <label className="block text-sm text-white/80 mb-3">Choose Role</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {roles.map((r, index) => (
            <motion.label
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer select-none rounded-xl p-4 border transition-all duration-300 ${
                form.role === r.id
                  ? "bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-indigo-400/50 shadow-lg"
                  : "bg-black/20 border-white/10 hover:border-white/20 hover:bg-black/30"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={form.role === r.id}
                onChange={onChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="text-sm font-medium text-white">{r.label}</div>
                <div className="text-xs text-white/60 mt-1">{r.description}</div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end pt-4">
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full px-6 py-3 text-sm bg-gradient-to-r from-indigo-500/40 to-purple-600/40 border border-white/20 hover:from-indigo-500/60 hover:to-purple-600/60 transition-all duration-300 font-medium text-white shadow-lg"
        >
          Continue →
        </motion.button>
      </div>
    </form>
  )
}

function RoleForm({ form, onChange, onBack, onSubmit, isSubmitting }) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="flex items-center justify-between">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ x: -5 }}
          className="text-sm text-white/60 hover:text-white/80 transition-colors"
        >
          ← Back
        </motion.button>
        <div className="text-sm text-white/70 flex items-center gap-2">
          <span>Role:</span>
          <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
            {roleLabel(form.role)}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {form.role === "developer" && (
          <motion.div
            key="developer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <EnhancedField label="Why do you want to join as Developer?" id="developerWhy">
              <textarea
                name="developerWhy"
                value={form.developerWhy}
                onChange={onChange}
                rows={4}
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40 resize-none"
                placeholder="Tell us about your passion for development..."
              />
            </EnhancedField>

            <EnhancedField label="Github Account URL" id="developerGithub">
              <input
                name="developerGithub"
                value={form.developerGithub}
                onChange={onChange}
                placeholder="https://github.com/yourname"
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
              />
            </EnhancedField>

            <EnhancedField label="Past Experience (short)" id="developerExp">
              <textarea
                name="developerExp"
                value={form.developerExp}
                onChange={onChange}
                rows={3}
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40 resize-none"
                placeholder="Briefly describe your development experience..."
              />
            </EnhancedField>
          </motion.div>
        )}

        {form.role === "public" && (
          <motion.div
            key="public"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <EnhancedField label="Why do you want to join as Public Reaction?" id="publicWhy">
              <textarea
                name="publicWhy"
                value={form.publicWhy}
                onChange={onChange}
                rows={4}
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40 resize-none"
                placeholder="Share your interest in public engagement..."
              />
            </EnhancedField>

            <EnhancedField label="Examples of campaigns or reactions you enjoyed" id="publicExamples">
              <textarea
                name="publicExamples"
                value={form.publicExamples}
                onChange={onChange}
                rows={3}
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40 resize-none"
                placeholder="Mention campaigns that inspired you..."
              />
            </EnhancedField>

            <EnhancedField label="Past Experience (short)" id="publicExp">
              <textarea
                name="publicExp"
                value={form.publicExp}
                onChange={onChange}
                rows={3}
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40 resize-none"
                placeholder="Describe your relevant experience..."
              />
            </EnhancedField>
          </motion.div>
        )}

        {form.role === "creator" && (
          <motion.div
            key="creator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <EnhancedField label="Why do you want to join as Content Creator?" id="creatorWhy">
              <textarea
                name="creatorWhy"
                value={form.creatorWhy}
                onChange={onChange}
                rows={4}
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40 resize-none"
                placeholder="Tell us about your creative vision..."
              />
            </EnhancedField>

            <EnhancedField label="Portfolio / Sample Content URL" id="creatorPortfolio">
              <input
                name="creatorPortfolio"
                value={form.creatorPortfolio}
                onChange={onChange}
                placeholder="https://youtube.com/.. or drive link"
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
              />
            </EnhancedField>

            <EnhancedField label="Preferred Platforms (short)" id="creatorPlatformPref">
              <input
                name="creatorPlatformPref"
                value={form.creatorPlatformPref}
                onChange={onChange}
                placeholder="YouTube, Instagram, X, TikTok..."
                className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none text-white placeholder-white/40 transition-all duration-300 focus:border-indigo-400/50 focus:bg-black/40"
              />
            </EnhancedField>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 flex items-center gap-3 justify-end">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full px-5 py-2 text-sm bg-transparent border border-white/10 text-white/80 hover:border-white/20 transition-all duration-300"
        >
          Edit Main
        </motion.button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          className="rounded-full px-6 py-2 text-sm bg-gradient-to-r from-indigo-500/40 to-purple-600/40 border border-white/20 text-white font-semibold shadow-lg hover:from-indigo-500/60 hover:to-purple-600/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </motion.button>
      </div>
    </form>
  )
}

function ThankYou({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20 relative"
    >
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 300,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-6xl mb-4"
      >
        🎉
      </motion.div>
      <h2 className="text-4xl font-bold text-white mb-4">Thank you, {name || "Friend"}!</h2>
      <p className="text-white/70 text-lg mb-2">Your application has been received successfully.</p>
      <p className="text-white/60">We will review it and get back to you soon.</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Application submitted successfully
        </div>
      </motion.div>
    </motion.div>
  )
}

function EnhancedField({ label, id, children, error, completed, focused }) {
  return (
    <motion.label
      className="block text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs text-white/70">{label}</div>
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 rounded-full bg-green-400 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        )}
        {focused && !completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"
          />
        )}
      </div>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1">
          {error}
        </motion.p>
      )}
    </motion.label>
  )
}

function roleLabel(id) {
  if (id === "developer") return "Developer"
  if (id === "public") return "Public Reaction"
  if (id === "creator") return "Content Creator"
  return "-"
}

function EnhancedAnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes floaty { 
          0%, 100% { transform: translateY(0px) rotate(0deg) } 
          33% { transform: translateY(-30px) rotate(120deg) } 
          66% { transform: translateY(-15px) rotate(240deg) } 
        }
        @keyframes pulse-glow { 
          0%, 100% { opacity: 0.3; transform: scale(1) } 
          50% { opacity: 0.6; transform: scale(1.1) } 
        }
        @keyframes drift { 
          0% { transform: translateX(0px) } 
          50% { transform: translateX(30px) } 
          100% { transform: translateX(0px) } 
        }
      `}</style>

      <div className="absolute inset-0 -z-10">
        {/* Main gradient orbs */}
        <div className="absolute -left-40 -top-40 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-purple-600/40 to-indigo-400/30 blur-3xl animate-[floaty_12s_ease-in-out_infinite]" />
        <div className="absolute -right-40 -bottom-40 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-rose-600/30 to-yellow-400/20 blur-3xl animate-[floaty_18s_ease-in-out_infinite]" />

        {/* Additional floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/10 blur-2xl animate-[pulse-glow_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-600/10 blur-2xl animate-[drift_15s_ease-in-out_infinite]" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/95 to-black" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
    </>
  )
}
