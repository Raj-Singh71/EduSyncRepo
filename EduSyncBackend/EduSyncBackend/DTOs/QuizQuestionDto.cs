using System.Collections.Generic;

namespace EduSyncBackend.DTOs
{
    public class QuizQuestionDto
    {
        public string QuestionText { get; set; }
        public string QuestionType { get; set; } // "MCQ" or "ShortAnswer"
        public List<string> Options { get; set; } // For MCQ
        public string CorrectAnswer { get; set; } // For MCQ
    }
}
