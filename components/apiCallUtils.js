
/* Generates a prefix of the form:
*  - /api/peer/<user-id>/
* or
* - /api/
*  */
function formatPrefix(isStudent, userId) {
    return `/api/${isStudent ? `peer/${userId}/` : ''}`
}

export { formatPrefix }