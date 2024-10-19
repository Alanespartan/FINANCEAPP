<template lang="pug">
.container
    nav(aria-label="breadcrumb")
        ol.breadcrumb
            li.breadcrumb-item
                a(href="/") Home
            li.breadcrumb-item
                a(href="/jobs/") Jobs
    .row
        .text-center(v-if="!loaded")
            .spinner-border.spinner
            h3 Loading...
        .col(v-else)
            .card
                .card-body.text-start
                    h4.card-title.fw-bold(v-html="title")
                    span.badge.bg-primary.rounded-pill.float-end(v-if="status" :style="badgeStyle[status]") {{ status }}
                    .card-text
                        .row.mb-2
                            .col-12
                                p ID: {{ id }}
                            .col-12
                                p Author: {{ createdBy }}
                            .col-xs-12.col-md-6(v-if="start")
                                p Started On: {{ start.toLocaleString() }}
                            .col-xs-12.col-md-6.text-xs-start.text-md-end(v-if="end")
                                p Completed On: {{ end.toLocaleString() }}
                            .col-xs-12.col-md-6(v-if="attachments")
                                button.btn.btn-info.text-white(
                                    type="button",
                                    @click="downloadAttachments()"
                                )
                                    span Download attachments
                        .row
                            .col
                                ul.list-group
                                    li.list-group-item(v-for="task in tasks" :key="task.title")
                                        .row
                                            .col-xs-12
                                                h5 Task: {{ task.title }}
                                            .col-xs-12
                                                .progress
                                                    .progress-bar.progress-bar-striped.progress-bar-animated(
                                                        role="progressbar",
                                                        v-if="task.progress === 0 && task.progressMax === 1"
                                                        style="width: 100%;"
                                                        aria-valuenow="0",
                                                        aria-valuemin="0",
                                                        aria-valuemax="1")
                                                    .progress-bar(role="progressbar",
                                                        v-else-if="task.progressMax",
                                                        :style="{ width: `${task.progress * 100 / task.progressMax}%` }"
                                                        :aria-valuenow="task.progress",
                                                        aria-valuemin="0",
                                                        :aria-valuemax="task.progressMax")
                                            .col-xs-12.text-center(v-if="task.progressLabel")
                                                span {{ task.progressLabel }}
                                            .col-xs-12
                                                table.table.table-sm
                                                    tbody
                                                        tr(v-for="msg in task.log" :key="msg.message")
                                                            td.timestamp-col {{ msg.timestamp.toISOString() }}
                                                            td.level-col {{ msg.level }}
                                                            td.message-col.text-break {{ msg.message }}
</template>
<style lang="scss" scoped>
table.table {
    td { padding-right: 1rem; }
    td.message-col {
        width: 100%;
    }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { hasJob, loadJob, loadTask } from "../../api";
import type { APIJob } from "@common/types/job";
import type { Task }   from "@common/types/task";
import store from "../../store";

const badgeStyleMap = {
    "not-started": "background-color: #3B73B9 !important",
    "in-progress": "background-color: #3B73B9 !important",
    "success":     "background-color: #4CAF50 !important",
    "error":       "background-color: #FF5252 !important",
    "abandoned":   "background-color: #FB8C00 !important"
};

type JobStatus = keyof typeof badgeStyleMap;

export default defineComponent({
    async beforeRouteEnter(to, _from, next) {
        const id = to.params.id;
        if(!id) { next(); }
        if(await hasJob(id as string)) { next(); }
        else { next("/"); }
    },
    data: () => ({
        title:       undefined as string | undefined,
        createdBy:   undefined as string | undefined,
        id:          undefined as string | undefined,
        status:      undefined as JobStatus | undefined,
        start:       undefined as Date | undefined,
        end:         undefined as Date | undefined,
        attachments: undefined as Record<string, any> | undefined,
        loaded:  false,
        tasks:   [] as Task[],
        taskMap: {} as Record<string, number>,
        ws:  null as WebSocket | null,
        wss: null as WebSocket | null
    }),
    computed: {
        badgeStyle() { return badgeStyleMap; }
    },
    async mounted() {
        console.log("const jobId = this.$route.params.id as string;");
        const jobId = "123456"
        const protocol = location.protocol;
        if(!(protocol === "https:" || protocol === "http:")) { console.error("No HTTP nor HTTPS protocol detected."); return; }

        switch (protocol) {
            case "http:":
                this.ws = new WebSocket(`ws://${location.host}${store.state.config.api_v1}/jobs/${jobId}/ws`);
                this.ws.onopen    = (ev) => { /* console.log(ev); */ };
                this.ws.onmessage = (ev) => { this.handleSocketMessage(JSON.parse(ev.data)); };
                this.ws.onerror   = (ev) => { /* console.log(ev); */ };
                this.ws.onclose   = (ev) => { /* console.log(ev); */ };
            break;
            case "https:":
                this.wss = new WebSocket(`wss://${location.host}${store.state.config.api_v1}/jobs/${jobId}/wss`);
                this.wss.onopen    = (ev) => { /* console.log(ev); */ };
                this.wss.onmessage = (ev) => { this.handleSocketMessage(JSON.parse(ev.data)); };
                this.wss.onerror   = (ev) => { /* console.log(ev); */ };
                this.wss.onclose   = (ev) => { /* console.log(ev); */ };
            break;
        }

    },
    methods: {
        handleSocketMessage(data: any) {
            if(data.task) { this.updateTask(data.task, data); }
            if(data.type === "job")    { this.onJob(loadJob(data)); }
            if(data.type === "status") { this.onStatus(data.status, data.timestamp); }
            if(data.type === "task")   { this.onTask(loadTask(data)); }
        },
        updateTask(title: string, data: any) {
            const taskIndex = this.taskMap[title];
            if(taskIndex === undefined) { return; }

            if(!data || !("type" in data)) { return; }

            if(data.type === "status") {
                this.tasks[taskIndex].status = data.status;
                if(data.status === "success" || data.status === "error" || data.status === "abandoned") {
                    this.tasks[taskIndex].end = new Date(data.timestamp);
                }
            } else if(data.type === "message") {
                this.tasks[taskIndex].log.push({
                    type: "message",
                    timestamp: new Date(data.timestamp),
                    message: data.message,
                    level: data.level
                });
            } else if(data.type === "progress") {
                this.tasks[taskIndex].progress = data.value;
                if(data.max) {
                    this.tasks[taskIndex].progressMax = data.max;
                }
                if(data.label) {
                    this.tasks[taskIndex].progressLabel = data.label;
                }
            }
            this.$forceUpdate();
        },
        onJob(job: APIJob) {
            this.title = job.title;
            this.id = job.id;
            this.createdBy = job.createdBy;
            this.status = job.status as JobStatus;
            this.start = job.start;
            this.tasks = job.tasks;
            this.tasks.forEach((task, index) => { this.taskMap[task.title] = index; });
            if(job.end) { this.end = job.end; }
            if(job.attachments) { this.attachments = job.attachments }

            if(this.status !== "in-progress" && this.status !== "not-started") {
                this.ws?.close();
                this.wss?.close();
            }
            this.loaded = true;
        },
        onStatus(status: string, timestamp: number) {
            this.status = status as JobStatus;
            this.end    = new Date(timestamp);
        },
        onTask(task: Task) {
            this.tasks = [ ...this.tasks, task ];
            this.taskMap[task.title] = this.tasks.length - 1;
        },
        downloadAttachments() {
            if(this.attachments) {
                for(const key in this.attachments) {
                    const filename = key;
                    const value = this.attachments[key];
                    const extension = key.split(".").pop();
                    let content;
                    if(extension === ".json") {
                        if (typeof value === 'string')
                            content = JSON.parse(value);
                        else
                            content = value;
                        content = JSON.stringify(content, null, '\t');
                        const jsonElement = document.createElement('a');
                        jsonElement.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
                        jsonElement.setAttribute('download', filename);

                        jsonElement.style.display = 'none';
                        document.body.appendChild(jsonElement);

                        jsonElement.click();
                        document.body.removeChild(jsonElement);
                    } else if (extension === ".txt") {
                        content = value.replaceAll(',', '\r\n');
                        const textElement = document.createElement('a');
                        textElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
                        textElement.setAttribute('download', filename);

                        textElement.style.display = 'none';
                        document.body.appendChild(textElement);

                        textElement.click();
                        document.body.removeChild(textElement);
                    } else if (extension === ".xml") {
                        content = value;
                        const textElement = document.createElement('a');
                        textElement.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(content));
                        textElement.setAttribute('download', filename);

                        textElement.style.display = 'none';
                        document.body.appendChild(textElement);

                        textElement.click();
                        document.body.removeChild(textElement);
                    } else {
                        content = value;
                        const textElement = document.createElement('a');
                        textElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
                        textElement.setAttribute('download', filename);

                        textElement.style.display = 'none';
                        document.body.appendChild(textElement);

                        textElement.click();
                        document.body.removeChild(textElement);
                    }
                }
            }
        }
    }
});
</script>
