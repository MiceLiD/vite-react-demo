/**
 * 执行document.execCommand
 * @param command string
 * @param value string
 * @return state boolean
 */
export const execCommand = (command: string, value: string) => {
  const input = document.createElement('input')
  input.setAttribute('value', value)
  input.setAttribute('id', 'copy-container')
  document.body.appendChild(input)
  input.select()
  const html = document.getElementById('copy-container')
  if (document.execCommand(command)) {
    document.execCommand(command)
    html && document.body.removeChild(html)
    return true
  }
  html && document.body.removeChild(html)
  return false
}
