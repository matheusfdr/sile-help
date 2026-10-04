// Components available in every article without import (passed to <Content components={…} />).
import Steps from './Steps.astro';
import Step from './Step.astro';
import Callout from './Callout.astro';
import Tip from './Tip.astro';
import Warning from './Warning.astro';
import Screenshot from './Screenshot.astro';
import Tabs from './Tabs.astro';
import Tab from './Tab.astro';
import Status from './Status.astro';
import TableWrap from './TableWrap.astro';

export const mdxComponents = { Steps, Step, Callout, Tip, Warning, Screenshot, Tabs, Tab, Status, table: TableWrap };
