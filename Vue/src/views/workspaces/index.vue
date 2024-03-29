<!--
Developers: Jason Liu
-->

<template>
  <div>
    <Taskbar title="Workspace Manager" />

    <v-container class="px-16 pt-8">
      <v-text-field
        append-icon="mdi-magnify"
        label="Workspace title"
        v-model="search"
        single-line
      ></v-text-field>
      <v-row class="mx-1 justify-center" no-gutters>
        <v-btn
          color="primary"
          @click="downloadData()"
          :disabled="filteredWorkspaces.length == 0"
          >Download all</v-btn
        >
        <v-btn
          class="ml-2"
          color="red"
          dark
          @click="
            if (filteredWorkspaces.length != 0) {
              popup = true;
            }
          "
          >Delete all</v-btn
        >
      </v-row>
    </v-container>

    <v-container class="workspaceContainer">
      <p v-show="filteredWorkspaces.length == 0" class="py-4 text-center">
        No workspaces found
      </p>
      <transition-group
        type="transition"
        name="workspaceCards"
        tag="v-row"
        dense
      >
        <v-col
          v-for="workspace in filteredWorkspaces"
          :key="workspace.id"
          cols="6"
        >
          <WorkspaceCard :workspace="workspace" />
        </v-col>
      </transition-group>
    </v-container>

    <v-dialog v-model="popup" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Confirm workspace deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete the following workspaces?
          <li v-for="workspace in filteredWorkspaces" :key="workspace.id">
            {{ workspace.title }}
          </li>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="popup = false">
            Cancel
          </v-btn>
          <v-btn color="red" text @click="deleteWorkspaces()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Taskbar from "@/components/Taskbar";
import WorkspaceCard from "@/components/WorkspaceCard";
import fileDownload from "js-file-download";
import jsonFormat from "json-format";

export default {
  name: "Workspaces",
  components: {
    Taskbar,
    WorkspaceCard,
  },
  data() {
    return {
      search: "",
      popup: false,
    };
  },
  computed: {
    filteredWorkspaces() {
      return this.$store.state.workspaces.filter((workspace) =>
        workspace.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    downloadData() {
      let data = [];
      this.filteredWorkspaces.forEach((workspace) => {
        data.push({
          Workspace: workspace.title,
          Question: workspace.qa.text,
          Answer: workspace.qa.answer_text,
          Genre: workspace.qa.genre,
        });
      });
      fileDownload(jsonFormat(data), "all_questions.json");
    },
    handleError() {
      alert("Error in downloading the JSON File.");
    },
    deleteWorkspaces() {
      this.filteredWorkspaces.forEach((workspace) => {
        this.$store.commit("deleteWorkspace", workspace.id);
      });
      this.popup = false;
    },
  },
};
</script>

<style scoped>
.workspaceContainer {
  height: calc(100vh - 220px);
  overflow: auto;
}

.workspaceCards-move {
  transition: transform 0.3s ease;
}

.workspaceCards-enter-active,
.workspaceCards-leave-active {
  display: none;
  position: absolute;
}
</style>