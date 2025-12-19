export class DeviceViewModel {
  constructor(
    private readonly deviceId: number,
    private readonly ip: string,
    private readonly title: string,
    private readonly lastSeenDate: Date,
  ) {}
}
