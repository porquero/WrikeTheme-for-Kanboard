<?php

namespace Kanboard\Plugin\WrikeTheme\Controller;

use Kanboard\Controller\BaseController;

class WrikeThemeController extends BaseController
{
    /**
     * Show the WrikeTheme settings page.
     */
    public function show()
    {
        $this->response->html($this->helper->layout->config('WrikeTheme:config/settings', [
            'title'         => 'WrikeTheme',
            'logo'          => $this->configModel->get('wriketheme_logo', ''),
            'header_color'  => $this->configModel->get('wriketheme_header_color', '#293D52'),
            'title_color'   => $this->configModel->get('wriketheme_title_color', '#FFFFFF'),
            'default_color' => $this->configModel->get('wriketheme_default_task_color', 'yellow'),
            'colors'        => $this->colorModel->getList(),
        ]));
    }

    /**
     * Save WrikeTheme settings.
     */
    public function save()
    {
        $values = $this->request->getValues();

        $this->configModel->save([
            'wriketheme_logo'               => trim($values['logo'] ?? ''),
            'wriketheme_header_color'       => trim($values['header_color'] ?? '#293D52'),
            'wriketheme_title_color'        => trim($values['title_color'] ?? '#FFFFFF'),
            'wriketheme_default_task_color' => trim($values['default_color'] ?? 'yellow'),
        ]);

        $this->flash->success(t('Settings saved successfully.'));
        $this->response->redirect($this->helper->url->to('WrikeThemeController', 'show', ['plugin' => 'WrikeTheme']));
    }

    /**
     * Toggle night mode for the current user (called via AJAX).
     * Stores preference in userMetadataModel so it persists across devices.
     */
    public function toggleNight()
    {
        $userId  = $this->userSession->getId();
        $current = $this->userMetadataModel->get($userId, 'wriketheme_night_mode', '0');
        $newVal  = ($current === '1') ? '0' : '1';

        $this->userMetadataModel->save($userId, ['wriketheme_night_mode' => $newVal]);

        $this->response->json(['night_mode' => $newVal]);
    }
}
