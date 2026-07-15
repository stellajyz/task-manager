using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetAll()
    {
        var tasks = await _context.TodoItems
            .AsNoTracking()
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync();

        return Ok(tasks);
    }

    // GET: /api/tasks/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetById(int id)
    {
        var task = await _context.TodoItems.FindAsync(id);

        if (task is null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    // POST: /api/tasks
    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create(TodoItem task)
    {
        task.Id = 0;
        task.IsCompleted = false;
        task.CreatedAt = DateTime.UtcNow;

        _context.TodoItems.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = task.Id },
            task);
    }

    // PUT: /api/tasks/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TodoItem updatedTask)
    {
        var existingTask = await _context.TodoItems.FindAsync(id);

        if (existingTask is null)
        {
            return NotFound();
        }

        existingTask.Title = updatedTask.Title;
        existingTask.Description = updatedTask.Description;
        existingTask.IsCompleted = updatedTask.IsCompleted;
        existingTask.DueDate = updatedTask.DueDate;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: /api/tasks/1/complete
    [HttpPatch("{id:int}/complete")]
    public async Task<IActionResult> MarkAsCompleted(int id)
    {
        var task = await _context.TodoItems.FindAsync(id);

        if (task is null)
        {
            return NotFound();
        }

        task.IsCompleted = true;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /api/tasks/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.TodoItems.FindAsync(id);

        if (task is null)
        {
            return NotFound();
        }

        _context.TodoItems.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}