import {
  ComponentRegistry,
} from 'nylas-exports';

import TodoistSidebar from './todoist-sidebar';


export function activate() {
  ComponentRegistry.register(TodoistSidebar, {
    role: 'MessageListSidebar:ContactCard',
  });
}

export function serialize() {

}

export function deactivate() {
  ComponentRegistry.unregister(TodoistSidebar);
}
