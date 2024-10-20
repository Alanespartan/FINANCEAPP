<template lang="pug">
.container
    nav(aria-label="breadcrumb")
        ol.breadcrumb
            li.breadcrumb-item
                a(href="/") Home
    .text-center(v-if="loading")
        .spinner-border.spinner
        h3 Loading...
    div(v-else)
        form(method="POST", v-on:submit.prevent)
            input.form-control(type="text", placeholder="Search for a job id", v-model="searchTerm")
            .alert.alert-danger.alert-danger.my-3.text-center(v-if="noSearchItem", role="alert") No search items were entered
            .row.justify-content-around.my-3
                input.btn.btn-secondary(
                    type="button",
                    value="Refresh",
                    style="width: 23%",
                    data-toggle="tooltip",data-placement="bottom",title="Fetch latest jobs list in server"
                    @click="populateJobs()")
                input.btn.btn-secondary(
                        type="button",
                        value="Reset",
                        data-toggle="tooltip",data-placement="bottom",title="Undo search and filters in current job list"
                        style="width: 23%",
                        @click="resetSearch()")
                input.btn(
                    :class="[toggleJobsBtnClass]",
                    type="button",
                    :value="[toggleJobsBtnText]",
                    style="width: 23%",
                    data-toggle="tooltip",data-placement="bottom",title="Toggle displayed jobs (All -> Trace -> Removal -> Link Corrector -> All)",
                    @click="toggleType()")
                input.btn.btn-primary.my-button(
                    type="submit",
                    value="Search",
                    style="width: 23%",
                    @click="search()")
        .row
            .col
                .card.text-start
                    .card-body
                        .card-text(v-if="jobsInPage.length > 0")
                            ul.list-group
                                li.list-group-item(v-for="job in jobsInPage", :key="job.id", @click="goToJob(job.id)")
                                    | {{ job.id }}
                                    // float-end result: Date Start - Type - Status
                                    span.badge.rounded-pill.float-end(:style="badgeStyle[job.status]") {{ job.status }}
                                    span.badge.rounded-pill.float-end.mx-1(:class="[badgeJobType(job.jobType)]") {{ job.jobType }}
                                    span.badge.rounded-pill.float-end.bg-primary {{ job.start }}
                        .card-text.text-center(v-else)
                            span
                                i There are no jobs running at the moment.
            .d-flex.justify-content-between.mt-3
                .table-page-no
                    span(v-if="allJobs.length === 0") Page 0 of 0
                    span(v-else) Page {{ currentPage + 1 }} of {{ Math.ceil(allJobs.length/pageSize) }}

                .pagination
                    nav(aria-label="Jobs pagination")
                        ul.pagination.justify-content-end
                            li.page-item(:class="{ disabled: currentPage === 0 }")
                                button.page-link(
                                    @click="handlePagination(0)",
                                    aria-label="First"
                                )
                                    span(aria-hidden="true") &laquo;&laquo; First
                            li.page-item(:class="{ disabled: currentPage === 0 }")
                                button.page-link(
                                    @click="handlePagination(currentPage - 1)",
                                    aria-label="Previous"
                                )
                                    span(aria-hidden="true") &laquo; Previous
                            li.page-item(:class="{ disabled: ((currentPage === Math.ceil(allJobs.length/pageSize) - 1) || allJobs.length === 0) }")
                                button.page-link(
                                    @click="handlePagination(currentPage + 1)",
                                    aria-label="Next"
                                )
                                    span(aria-hidden="true") Next &raquo;
                            li.page-item(:class="{ disabled: ((currentPage === Math.ceil(allJobs.length/pageSize) - 1) || allJobs.length === 0) }")
                                button.page-link(
                                    @click="handlePagination(Math.ceil(allJobs.length/pageSize) - 1)",
                                    aria-label="Last"
                                )
                                    span(aria-hidden="true") Last &raquo;&raquo;

</template>
<script lang="ts">
import { defineComponent } from "vue";
import type { JobSummary } from "@common/types/job";
import { getJobs }         from "../../api";

type JobTypes = "All" | "Trace" | "Removal" | "Link Corrector";

const badgeStyleMap = {
    "not-started": "background-color: #3B73B9 !important",
    "in-progress": "background-color: #3B73B9 !important",
    "success":     "background-color: #198754 !important",
    "error":       "background-color: #DC3545 !important",
    "abandoned":   "background-color: #FB8C00 !important",
    "info":        "background-color: #6C757D !important"
};

export default defineComponent({
    data: () => ({
        loading: false,
        searchTerm: "",
        noSearchItem: false,
        initJobs:    [] as JobSummary[],
        allJobs:     [] as JobSummary[],
        traceJobs:   [] as JobSummary[],
        removalJobs: [] as JobSummary[],
        lcJobs:      [] as JobSummary[],
        jobsInPage:  [] as JobSummary[],
        currentType: "All" as JobTypes,
        types: undefined  as undefined | JobTypes,
        pageSize: 15,
        currentPage: 0
    }),
    async created() {
        await this.populateJobs();
    },
    computed: {
        badgeStyle() { return badgeStyleMap; },
        toggleJobsBtnClass() {
            return this.currentType === "Trace" ? "btn-info text-white" : this.currentType === "Removal" ? "btn-warning text-white" : this.currentType === "Link Corrector" ? "btn-dark" : "btn-secondary";
        },
        toggleJobsBtnText() {
            return this.currentType === "Trace" ? "Only show removals" : this.currentType === "Removal" ? "Only show link corrector" : this.currentType === "Link Corrector" ? "Show all jobs" : "Only show traces";
        }
    },
    methods: {
        goToJob(id: string) {
            this.$router.push({ path: `/jobs/${id}` });
        },
        getTime(date?: Date) {
            return date != null ? date.getTime() : 0;
        },
        badgeJobType(jobType: string) {
            return jobType === "Trace" ? "bg-info" : jobType === "Removal" ? "bg-warning" : jobType === "Link Corrector" ? "bg-dark" : "bg-danger";
        },
        async populateJobs() {
            this.loading  = true;
            this.initJobs = (await getJobs()).sort((a, b) => {
                return this.getTime(b.start) - this.getTime(a.start);
            });
            this.traceJobs   = this.initJobs.filter((job) => job.jobType === "Trace");
            this.removalJobs = this.initJobs.filter((job) => job.jobType === "Removal");
            this.lcJobs      = this.initJobs.filter((job) => job.jobType === "Link Corrector");
            this.resetSearch();
            this.loading = false;
        },
        async toggleType() {
            this.currentPage = 0;
            switch (this.currentType) {
                case "All":            this.allJobs = this.traceJobs;   this.currentType = "Trace"; break;
                case "Trace":          this.allJobs = this.removalJobs; this.currentType = "Removal"; break;
                case "Removal":        this.allJobs = this.lcJobs;      this.currentType = "Link Corrector"; break;
                case "Link Corrector": this.allJobs = this.initJobs;    this.currentType = "All"; break;
                default:               this.allJobs = this.traceJobs;   this.currentType = "Trace"; break;
            }
            if(this.searchTerm === "") { this.doPagination(); }
            else { this.search(); }
        },
        resetSearch() {
            this.allJobs      = this.initJobs;
            this.noSearchItem = false;
            this.searchTerm   = "";
            this.currentType  = "All";
            this.currentPage  = 0;
            this.doPagination();
        },
        search() {
            this.loading = true;
            this.allJobs = [];
            const searchTerms = this.searchTerm.toLowerCase().split(" ").filter((term) => term !== "");
            if(searchTerms.length > 0) {
                this.noSearchItem = false;
                for(const term of searchTerms) {
                    let auxArray: JobSummary[] = [];
                    if(this.currentType === "All") {
                        auxArray = this.initJobs.filter((job)    => job.id.includes(term) || job.id == this.searchTerm);
                    } else if(this.currentType === "Trace") { // Only find in trace jobs list
                        auxArray = this.traceJobs.filter((job)   => job.id.includes(term) || job.id == this.searchTerm);
                    } else if(this.currentType === "Removal") { // Only find in removal jobs list
                        auxArray = this.removalJobs.filter((job) => job.id.includes(term) || job.id == this.searchTerm);
                    } else if(this.currentType === "Link Corrector") { // Only find in Link Corrector jobs list
                        auxArray = this.lcJobs.filter((job) => job.id.includes(term) || job.id == this.searchTerm);
                    }
                    this.allJobs = this.allJobs.concat(auxArray);
                }
                this.doPagination();
            } else {
                this.noSearchItem = true;
            }
            this.loading = false;
        },
        handlePagination(newPage: number) {
            this.currentPage = newPage;
            this.doPagination();
        },
        doPagination() {
            const startIndex = this.currentPage * this.pageSize;
            const endIndex   = startIndex + this.pageSize;
            this.jobsInPage  = this.allJobs.slice(startIndex, endIndex);
        },
    }
});
</script>
<style lang="scss" scoped>
li.list-group-item {
    cursor: pointer;

    &:hover {
        background-color: #ddd;
    }
}
</style>
