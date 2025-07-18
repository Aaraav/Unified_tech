function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function error(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, error };
