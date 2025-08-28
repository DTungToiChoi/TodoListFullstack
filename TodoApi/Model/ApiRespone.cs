using System;
using TodoApi.Model;

namespace TodoApi.Model
{
    public class ApiRespone<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Error { get; set; } = null;
    }
}