
/* Generates a prefix of the form:
*  - /api/peer/<user-id>/
* or
* - /api/
*  */
function formatPrefix(isStudent, userId) {
    return `/api/${isStudent ? `peer/${userId}/` : ''}`
}

function formatPrefixAndRoot(isStudent, userId, studentRoot, nonStudentRoot) {
    return formatPrefix(isStudent, userId) + (isStudent ? studentRoot : nonStudentRoot)
}

export { formatPrefix, formatPrefixAndRoot }