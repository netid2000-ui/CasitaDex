Pod::Spec.new do |s|
  s.name = 'CasitaDexReminderAlerts'
  s.version = '1.0.0'
  s.summary = 'On-device reminders for CasitaDex'
  s.description = s.summary
  s.license = { :type => 'Proprietary' }
  s.author = 'Designs by F&A'
  s.homepage = 'https://github.com/netid2000-ui/CasitaDex'
  s.source = { :git => s.homepage + '.git' }
  s.platforms = { :ios => '16.4' }
  s.swift_version = '5.9'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '*.swift'
end
