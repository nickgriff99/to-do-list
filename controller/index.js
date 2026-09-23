const formidable = require('formidable');
const { create, get, remove } = require('../model/todo');

exports.create = (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields) => {
    if (err) {
      res.status(500).json({ error: 'Failed to parse form data' });
      return;
    }

    // formidable v2 returns field values as arrays
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;

    if (!description) {
      res.status(400).json({ error: 'description is required' });
      return;
    }

    try {
      const result = await create(description);
      res.status(201).json(result.rows[0]);
    } catch (dbErr) {
      res.status(500).json({ error: 'Failed to create todo' });
    }
  });
};

exports.read = async (req, res) => {
  try {
    const result = await get();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

exports.removeTodo = async (req, res) => {
  try {
    await remove(req.params.id);
    res.status(200).json({ success: true, todo_id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
