using System;
using TodoApi.Model;

namespace TodoApi.Model
{
    public class TodoDto
    {
        public string Title { get; set; } = string.Empty;
        public bool? IsDone { get; set; } 
    }
}
