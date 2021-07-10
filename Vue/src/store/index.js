import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import { defaultWorkspace, defaultQA, initial_workspaces, widgetTemplate } from './workspace';
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		workspaces: initial_workspaces,
		workspace_index: initial_workspaces.length,
		workspace_stack: initial_workspaces.map((workspace) => workspace.id),
		widget_types: [ 'Timer', 'Pronunciation', 'Representation' ]
	},
	modules: {
		app,
		settings,
		user
	},
	mutations: {
		addWorkspace(state) {
			workspaces.push(defaultWorkspace(state.workspace_index));
			workspace_index++;
		},
		deleteWorkspace(state, id) {
			state.workspaces = state.workspaces.filter((workspace) => workspace.id !== id);
		},
		addWidget(state, { workspace_id, type }) {
			let workspace = getters.workspace(state)(workspace_id);
			workspace.widgets.push(widgetTemplate(workspace.widget_index, type));
			workspace.widget_index++;
		},
		deleteWidget(state, { workspace_id, widget_id }) {
			let workspace = getters.workspace(state)(workspace_id);
			workspace.widgets = workspace.widgets.filter((widget) => widget.id !== widget_id);
		},
		toggleWidget(state, { workspace_id, widget_id }) {
			let workspace = getters.workspace(state)(workspace_id);
			workspace.widgets = workspace.widgets.map(
				(widget) => (widget.id === widget_id ? { ...widget, expanded: !widget.expanded } : widget)
			);
		},
		updateWidget(state, { workspace_id, payload }) {
			let workspace = getters.workspace(state)(workspace_id);
			workspace.widgets = workspace.widgets.map(
				(widget) => (widget.id === payload.id ? Object.assign(widget, payload) : widget)
			);
		},
		updateQA(state, { workspace_id, payload }) {
			let workspace = getters.workspace(state)(workspace_id);
			workspace.qas = workspace.qas.map((qa) => (qa.id === payload.id ? Object.assign(qa, payload) : qa));
		},
		createQA(state, workspace_id) {
			let workspace = getters.workspace(state)(workspace_id);
			let newQA = defaultQA(workspace.qa_index);
			workspace.qas.push(newQA);
			workspace.qa_index++;
			workspace.qa_selected = newQA.id;
		},
		deleteQA(state, { workspace_id, qa_id }) {
			let workspace = getters.workspace(state)(workspace_id);
			if (workspace.qas.length === 1) {
				return;
			}
			workspace.qas = workspace.qas.filter((qa) => qa.id !== qa_id);
			if (workspace.qa_selected === qa_id) {
				workspace.qa_selected = workspace.qas[0].id;
			}
		},
		selectWorkspace(state, workspace_id) {
			this.state.workspace_stack = this.state.workspace_stack.filter((id) => id !== workspace_id);
			this.state.workspace_stack.push(workspace_id);
		}
	},
	getters: {
		sidebar: (state) => state.app.sidebar,
		device: (state) => state.app.device,
		token: (state) => state.user.token,
		avatar: (state) => state.user.avatar,
		name: (state) => state.user.name,
		...getters
	}
});

export default store;
