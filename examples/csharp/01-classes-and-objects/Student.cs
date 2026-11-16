namespace ConceptLab.Ch01;

public class Student
{
    private int _score;

    public string StudentId { get; }
    public string Name { get; private set; }
    public int Score => _score;

    public Student(string studentId, string name, int initialScore)
    {
        StudentId = studentId;
        Name = name;
        _score = initialScore;
    }

    public void UpdateScore(int newScore)
    {
        if (newScore >= 0 && newScore <= 100)
        {
            _score = newScore;
        }
    }

    public string GetSummary()
    {
        string level = _score >= 60 ? "及格" : "需加強";
        return $"{StudentId} {Name}｜成績：{_score} 分（{level}）";
    }
}
