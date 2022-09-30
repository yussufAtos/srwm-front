import { Component, OnInit } from '@angular/core'
import { WebstoryRepositoryService } from '@webstory/editor'

@Component({
  selector: 'webstory-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'webstory'

  constructor(private webstoryRepositoryService: WebstoryRepositoryService) {}

  ngOnInit(): void {
    this.webstoryRepositoryService
      .getWebstoryByGuid('http://iamconnected.com')
      .subscribe()
  }
}
