
/* Generates a prefix of the form:
*  - /api/peer/<user-id>/
* or
* - /api/
*  */
function formatRoot(isStudent, userId) {
    return `/api/${isStudent ? `peer/${userId}/` : ''}`
}

export { formatRoot }