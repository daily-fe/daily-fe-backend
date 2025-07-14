import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScrapeAndSaveFeedsUseCase } from '../use-cases/scrape-and-save-feeds.usecase';

@Injectable()
export class FeedScrapingScheduler {
	private readonly logger = new Logger(FeedScrapingScheduler.name);

	constructor(private readonly scrapeAndSaveFeedsUseCase: ScrapeAndSaveFeedsUseCase) {}

	// @Cron('0 0 * * *')
	@Cron('* * * * *')
	async handleCron() {
		this.logger.log('⏰ [Scheduler] 피드 스크래핑 및 저장 시작');
		try {
			const savedCount = await this.scrapeAndSaveFeedsUseCase.execute();
			this.logger.log(`✅ [Scheduler] 신규 피드 ${savedCount}건 저장 완료`);
		} catch (e) {
			this.logger.error(`[Scheduler] 스크래핑/저장 실패: ${e.message}`);
		}
	}
}
