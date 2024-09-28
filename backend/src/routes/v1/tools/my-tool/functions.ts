/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Rx from "rxjs";
import { Logger } from "@common/types/logger";
import { Job, Task } from "@backend/routes/utils/job";

const logger = new Logger("functions.ts");

interface UpdateResponse {
    fixedLinks:       number;
    countLegacy:      number;
    countIncorrect:   number;
    countCorrect:     number;
    updatedArtifacts: string[];
    failedToUpdate:   string[];
}

export async function rxUsageFunction(
    job: Job,
    fetchTask: Task
) {
    fetchTask.setProgressMax(10);
    fetchTask.setProgress(0, "%value%/%max% objects fetched");
    fetchTask.info(`${10} artifacts to fetch`);
    // let fetchIndex = 0;

    const updateTask = job.createSubTask("Sub Task Creation", "First sub task message...");
    updateTask.setProgress(0, "%value%/%max% objects reviewed");
    let toReview       = 0;
    let linksFixed     = 0;
    let countLegacy    = 0;
    let countIncorrect = 0;
    let countCorrect   = 0;

    const objectsFilter = (artifact: unknown) => {
        if(linksFixed % 2 === 0) {
            if(artifact) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    };

    const stringArray = [ "id1", "id2", "id3", "id4" ];
    await Rx.lastValueFrom(Rx.from(stringArray).pipe(
        Rx.mergeMap((uri: string) => {
            console.log(uri);
            /*
            Object.fetch(connection, uri)
                .then((obj) => {
                    fetchTask.setProgress(++fetchIndex);
                    return obj;
                })
                .catch(() => {
                    const msg = `Error fetching object at '${uri}'`;
                    fetchTask.error(msg);
                    return undefined;
                }) as Promise<Object>
            */
            return {} as any;
        }, 4),
        Rx.filter<any>((obj) => obj && objectsFilter(obj)),
        Rx.tap({
            next() { updateTask.setProgressMax(++toReview); },
            error(err: unknown) {
                logger.error("There was an error fetching and filtering objects! Stopped.");
                fetchTask.error("There was an error fetching and filtering objects! Stopped.");
                fetchTask.finishTask("error");
                job.finishJob("error");
                console.log(err);
            },
            complete() {
                fetchTask.info(`All objects fetched and tested. ${toReview} meet the conditions to be analyzed`);
                fetchTask.finishTask("success");
            }
        }),
        Rx.bufferCount(50),
        Rx.mergeMap((objs) => stagedObjsUpdate(objs), 1),
        Rx.tap({
            next(res: UpdateResponse) {
                linksFixed     += res.fixedLinks;
                countLegacy    += res.countLegacy;
                countIncorrect += res.countIncorrect;
                countCorrect   += res.countCorrect;
                console.log(countLegacy, countIncorrect, countCorrect);
            },
            error(err) {
                logger.error("There was an error reviewing and updating objects! Stopped.");
                updateTask.error("There was an error reviewing and updating objects! Stopped.");
                updateTask.finishTask("error");
                job.finishJob("error");
                console.log(err);
            },
            complete() {
                if(toReview === 0) {
                    updateTask.info("No objects reviewed.");
                    updateTask.finishTask("success");
                    updateTask.setProgressMax(0);
                    updateTask.setProgress(0, "%value%/%max% objects reviewed");
                    job.finishJob("info");
                } else {
                    updateTask.finishTask("success");
                    job.finishJob("success");
                }
            }
        })
    ), { defaultValue: "No elements to update" });
}

export async function stagedObjsUpdate(objs: any) {
    const fixedLinks     = 0;
    const countLegacy    = 0;
    const countIncorrect = 0;
    const countCorrect   = 0;
    console.log(objs);
    return { fixedLinks, countLegacy, countIncorrect, countCorrect } as UpdateResponse;
}

