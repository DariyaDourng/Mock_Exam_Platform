import { QuestionModal } from "./question-modal"


interface UpdateQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
   questionId: string | number
}

export function UpdateQuestionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  questionId,
}: UpdateQuestionModalProps) {
  return (
    <QuestionModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmitSuccess={onSubmitSuccess}
      questionId={questionId}
      mode= "edit"
       
    />
  )
}
