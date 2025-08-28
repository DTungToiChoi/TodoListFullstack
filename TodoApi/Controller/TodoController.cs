using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Model;

namespace TodoApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoController(TodoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiRespone<IEnumerable<Todo>>>> GetTodos()
        {
            var todos = await _context.Todos.ToListAsync();
            return Ok(new ApiRespone<IEnumerable<Todo>>
            {
                Success = true,
                Data = todos,
                Message = "Danh sách todos lấy thành công"
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiRespone<Todo>>> GetTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
                return NotFound(new ApiRespone<Todo>
                {
                    Success = false,
                    Message = "Todo không tồn tại",
                    Error = $"Không tìm thấy Todo với id = {id}"
                });

            return Ok(new ApiRespone<Todo>
            {
                Success = true,
                Data = todo,
                Message = "Lấy Todo thành công"
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiRespone<Todo>>> PostTodo(TodoDto todoDto)
        {
            var todo = new Todo
            {
                Title = todoDto.Title,
                IsDone = todoDto.IsDone ?? false
            };

            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, new ApiRespone<Todo>
            {
                Success = true,
                Data = todo,
                Message = "Thêm Todo thành công"
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiRespone<object>>> PutTodo(int id, TodoDto todoDto)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
                return NotFound(new ApiRespone<object>
                {
                    Success = false,
                    Message = "Todo không tồn tại",
                    Error = $"Không tìm thấy Todo với id = {id}"
                });

            todo.Title = todoDto.Title;
            if (todoDto.IsDone.HasValue) todo.IsDone = todoDto.IsDone.Value;

            await _context.SaveChangesAsync();

            return Ok(new ApiRespone<object>
            {
                Success = true,
                Message = "Cập nhật Todo thành công"
            });
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ApiRespone<object>>> PatchTodo(int id, TodoDto todoDto)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
                return NotFound(new ApiRespone<object>
                {
                    Success = false,
                    Message = "Todo không tồn tại",
                    Error = $"Không tìm thấy Todo với id = {id}"
                });

            if (!string.IsNullOrEmpty(todoDto.Title)) todo.Title = todoDto.Title;
            if (todoDto.IsDone.HasValue) todo.IsDone = todoDto.IsDone.Value;

            await _context.SaveChangesAsync();

            return Ok(new ApiRespone<object>
            {
                Success = true,
                Message = "Cập nhật một phần Todo thành công"
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiRespone<object>>> DeleteTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
                return NotFound(new ApiRespone<object>
                {
                    Success = false,
                    Message = "Todo không tồn tại",
                    Error = $"Không tìm thấy Todo với id = {id}"
                });

            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();

            return Ok(new ApiRespone<object>
            {
                Success = true,
                Message = "Xóa Todo thành công"
            });
        }
    }
}
