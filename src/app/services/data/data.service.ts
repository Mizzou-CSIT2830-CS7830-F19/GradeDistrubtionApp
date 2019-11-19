import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { Professor, ClassData, AddProfessorDataResponse } from "src/types";
import { HttpClient } from "@angular/common/http";
import { prettifyName } from "../../../utils";
import { AuthService } from "../auth/auth.service";
import { map, switchMap } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  getProfessors(): Observable<Professor[]> {
    console.log("here");
    const currentUser = this.afAuth.auth.currentUser;
    if (currentUser) {
      return this.db
        .collection<Professor>("professors", ref =>
          ref.where("trackedBy", "array-contains", currentUser.uid)
        )
        .valueChanges()
        .pipe(
          map(professors =>
            professors.sort((profA, profB) => {
              return profA.name > profB.name ? 1 : -1;
            })
          )
        );
    }
    // this shouldn't happen, but just in case this will keep us from crashing
    return of([]);
  }

  getClasses(professorId: string): Observable<ClassData[]> {
    return this.db
      .collection("professors")
      .doc(professorId)
      .collection<ClassData>("classes")
      .valueChanges();
  }

  getProfessorDetails(professorId: string): Observable<Professor> {
    return this.db
      .collection("professors")
      .doc<Professor>(professorId)
      .valueChanges();
  }

  addProfessorData(professorName: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      // this is the URL to the scraper code located on Google Cloud
      const url =
        "https://us-central1-grade-distribution.cloudfunctions.net/update_prof_distributions-2";
      const auth = this.afAuth.auth.currentUser;
      if (!auth) {
        reject("Unable to authenticate");
      }
      const data = {
        prof: professorName,
        user_id: auth.uid
      };
      this.http.post<AddProfessorDataResponse>(url, data).subscribe(
        res => {
          resolve(
            `Added ${res.classesAdded} classes for ${prettifyName(
              professorName
            )}`
          );
        },
        () => {
          reject(
            `An error occurred while adding classes for ${prettifyName(
              professorName
            )}`
          );
        }
      );
    });
  }

  getClassDetails(professorId: string, classId: string): Observable<ClassData> {
    return this.db
      .collection("professors")
      .doc(professorId)
      .collection("classes")
      .doc<ClassData>(classId)
      .valueChanges();
  }
}
