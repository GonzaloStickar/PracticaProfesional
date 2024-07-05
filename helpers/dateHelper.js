function formatDateString(dateString) {
    const fecha = new Date(dateString);
    const formattedDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
}

module.exports = {
    formatDateString
};