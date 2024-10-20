'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function SpeechAiSettingsModal() {
  const [open, setOpen] = useState(true)
  const [title, setTitle] = useState("")
  const [speech, setSpeech] = useState("")
  const [increaseKnowledge, setIncreaseKnowledge] = useState(false)
  const [errors, setErrors] = useState({ title: false, speech: false })

  const handleProceed = () => {
    const newErrors = {
      title: title.trim() === "",
      speech: speech.trim() === ""
    }
    setErrors(newErrors)

    if (!newErrors.title && !newErrors.speech) {
      setOpen(false)
      // Here you can add logic to handle the form submission
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>SpeechAI Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Speech Title
            </Label>
            <div className="col-span-3">
              <Input
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setErrors(prev => ({ ...prev, title: false }))
                }}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speech" className="text-right">
              Explain your speech
            </Label>
            <div className="col-span-3">
              <Textarea
                id="speech"
                placeholder="Type your speech note here"
                value={speech}
                onChange={(e) => {
                  setSpeech(e.target.value)
                  setErrors(prev => ({ ...prev, speech: false }))
                }}
                className={errors.speech ? "border-red-500" : ""}
              />
              {errors.speech && <p className="text-red-500 text-sm mt-1">Speech explanation is required</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="increase-knowledge"
              checked={increaseKnowledge}
              onCheckedChange={setIncreaseKnowledge}
            />
            <Label htmlFor="increase-knowledge">Increase QA Agent Knowledge</Label>
          </div>
        </div>
        <Button className="w-full" onClick={handleProceed}>
          Proceed
        </Button>
      </DialogContent>
    </Dialog>
  )
}