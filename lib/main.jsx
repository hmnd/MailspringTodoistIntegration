import { ComponentRegistry } from 'nylas-exports';
import TodoistSidebar from './todoist-sidebar';
import TodoistLabel from './todoist-label';

export function activate() {
  ComponentRegistry.register(TodoistSidebar, {
    role: 'MessageListSidebar:ContactCard',
  });

  ComponentRegistry.register(TodoistLabel, {
    role: 'Thread:MailLabel',
  });
}
export function deactivate() {
  ComponentRegistry.unregister(TodoistComposer);
  ComponentRegistry.unregister(TodoistSidebar);
  ComponentRegistry.unregister(TodoistLabel);
}
